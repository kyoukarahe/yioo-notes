param(
  [string] $Bucket = "yioo-notes",
  [string] $DistributionId = "EWYEJXEIKC81C",
  [string] $Prefix = "notes",
  [switch] $SkipBuild,
  [switch] $NoInvalidate,
  [switch] $DryRun,
  [switch] $ConfirmFullRelease,
  [switch] $AllowTargetOverride
)

$ErrorActionPreference = "Stop"

$canonicalBucket = "yioo-notes"
$canonicalDistributionId = "EWYEJXEIKC81C"
$canonicalPrefix = "notes"
$canonicalRegion = "ap-northeast-1"
$root = Split-Path -Parent $PSScriptRoot
$distNotes = Join-Path $root "dist\notes"

function Invoke-Native {
  param(
    [Parameter(Mandatory = $true)][string] $Command,
    [Parameter(Mandatory = $true)][string[]] $Arguments,
    [switch] $Capture
  )

  Write-Host "[deploy] $Command $($Arguments -join ' ')"
  if ($Capture) {
    $output = & $Command @Arguments 2>&1
    $exitCode = $LASTEXITCODE
    if ($exitCode -ne 0) {
      if ($output) { $output | Write-Output }
      throw "$Command exited with code $exitCode"
    }
    return ($output -join "`n")
  }

  & $Command @Arguments
  $exitCode = $LASTEXITCODE
  if ($exitCode -ne 0) {
    throw "$Command exited with code $exitCode"
  }
}

function Invoke-NativeJson {
  param(
    [Parameter(Mandatory = $true)][string] $Command,
    [Parameter(Mandatory = $true)][string[]] $Arguments
  )

  $raw = Invoke-Native -Command $Command -Arguments ($Arguments + @("--output", "json")) -Capture
  try {
    return $raw | ConvertFrom-Json
  }
  catch {
    throw "Could not parse JSON from $Command $($Arguments -join ' '): $($_.Exception.Message)"
  }
}

function Assert-DeploymentTarget {
  $overrides = @()
  if ($Bucket -ne $canonicalBucket) { $overrides += "Bucket" }
  if ($DistributionId -ne $canonicalDistributionId) { $overrides += "DistributionId" }
  if ($Prefix -ne $canonicalPrefix) { $overrides += "Prefix" }
  if ($overrides.Count -gt 0 -and -not $AllowTargetOverride) {
    throw "Deployment target override requires -AllowTargetOverride: $($overrides -join ', ')"
  }

  if ([string]::IsNullOrWhiteSpace($Prefix) -or $Prefix.Contains("..") -or $Prefix.Contains("/")) {
    throw "Unsafe deployment prefix: $Prefix"
  }

  $identity = Invoke-NativeJson -Command "aws" -Arguments @("sts", "get-caller-identity")
  Invoke-Native -Command "aws" -Arguments @("s3api", "head-bucket", "--bucket", $Bucket, "--expected-bucket-owner", $identity.Account) -Capture | Out-Null
  $locationResponse = Invoke-NativeJson -Command "aws" -Arguments @("s3api", "get-bucket-location", "--bucket", $Bucket)
  $location = if ($null -eq $locationResponse.LocationConstraint) { "us-east-1" } else { [string]$locationResponse.LocationConstraint }
  if ($Bucket -eq $canonicalBucket -and $location -ne $canonicalRegion) {
    throw "Unexpected region for ${Bucket}: $location"
  }
  $versioning = Invoke-NativeJson -Command "aws" -Arguments @("s3api", "get-bucket-versioning", "--bucket", $Bucket)
  if ($Bucket -eq $canonicalBucket -and $versioning.Status -ne "Enabled") {
    throw "S3 versioning is not enabled for ${Bucket}: $($versioning.Status)"
  }

  $response = Invoke-NativeJson -Command "aws" -Arguments @("cloudfront", "get-distribution", "--id", $DistributionId)
  $distribution = $response.Distribution
  $config = $distribution.DistributionConfig
  if ($null -eq $distribution -or $null -eq $config) {
    throw "CloudFront distribution was not returned: $DistributionId"
  }
  $distributionAccount = ([string]$distribution.ARN).Split(":")[4]
  if ($distributionAccount -and $distributionAccount -ne $identity.Account) {
    throw "CloudFront account mismatch: $distributionAccount != $($identity.Account)"
  }
  if ($distribution.Status -ne "Deployed" -or $config.Enabled -ne $true) {
    throw "CloudFront distribution is not enabled and deployed: status=$($distribution.Status), enabled=$($config.Enabled)"
  }

  $expectedPatterns = @("/$Prefix", "/$Prefix/*")
  $matchingBehaviors = @($config.CacheBehaviors.Items | Where-Object { $expectedPatterns -contains $_.PathPattern })
  if ($matchingBehaviors.Count -eq 0) {
    throw "CloudFront has no cache behavior for /$Prefix or /$Prefix/*"
  }
  foreach ($behavior in $matchingBehaviors) {
    $origin = @($config.Origins.Items | Where-Object { $_.Id -eq $behavior.TargetOriginId }) | Select-Object -First 1
    if ($null -eq $origin -or -not ([string]$origin.DomainName).ToLowerInvariant().Contains($Bucket.ToLowerInvariant())) {
      throw "CloudFront behavior $($behavior.PathPattern) does not target bucket $Bucket"
    }
  }

  Write-Output "[deploy] target verified: account=$($identity.Account), bucket=$Bucket, region=$location, versioning=$($versioning.Status), distribution=$DistributionId"
}

if (-not $DryRun -and -not $ConfirmFullRelease) {
  throw "A production deployment requires -ConfirmFullRelease because the command replaces the complete notes release."
}

Push-Location $root
try {
  if (-not $SkipBuild) {
    Invoke-Native -Command "npm.cmd" -Arguments @("run", "build")
  }

  if (-not (Test-Path $distNotes)) {
    throw "Missing build output: $distNotes"
  }

  Invoke-Native -Command "npm.cmd" -Arguments @("run", "verify:build")
}
finally {
  Pop-Location
}

Assert-DeploymentTarget
$destination = "s3://$Bucket/$Prefix"

Write-Output "[deploy] AWS full-release preview; review upload and delete actions before publishing"
Invoke-Native -Command "aws" -Arguments @("s3", "sync", $distNotes, $destination, "--delete", "--dryrun", "--cache-control", "no-cache")

if ($DryRun) {
  Write-Output "[deploy] dry run complete; no upload or invalidation was performed"
  exit 0
}

Invoke-Native -Command "aws" -Arguments @("s3", "sync", $distNotes, $destination, "--delete", "--cache-control", "no-cache")
Invoke-Native -Command "aws" -Arguments @("s3", "cp", $distNotes, $destination, "--recursive", "--exclude", "*", "--include", "*.html", "--cache-control", "no-cache", "--content-type", "text/html; charset=utf-8")
Invoke-Native -Command "aws" -Arguments @("s3", "cp", $distNotes, $destination, "--recursive", "--exclude", "*", "--include", "*.json", "--cache-control", "no-cache", "--content-type", "application/json; charset=utf-8")
Invoke-Native -Command "aws" -Arguments @("s3", "cp", $distNotes, $destination, "--recursive", "--exclude", "*", "--include", "*.xml", "--cache-control", "no-cache", "--content-type", "application/xml; charset=utf-8")

$rssPath = Join-Path $distNotes "rss.xml"
if (Test-Path $rssPath) {
  Invoke-Native -Command "aws" -Arguments @("s3", "cp", $rssPath, "$destination/rss.xml", "--cache-control", "no-cache", "--content-type", "application/rss+xml; charset=utf-8")
}

$assetsPath = Join-Path $distNotes "assets"
if (Test-Path $assetsPath) {
  Invoke-Native -Command "aws" -Arguments @("s3", "cp", $assetsPath, "$destination/assets", "--recursive", "--cache-control", "no-cache")
}

$stylesPath = Join-Path $distNotes "styles.css"
if (Test-Path $stylesPath) {
  Invoke-Native -Command "aws" -Arguments @("s3", "cp", $stylesPath, "$destination/styles.css", "--cache-control", "no-cache", "--content-type", "text/css; charset=utf-8")
}

$astroAssetsPath = Join-Path $distNotes "_astro"
if (Test-Path $astroAssetsPath) {
  Invoke-Native -Command "aws" -Arguments @("s3", "cp", $astroAssetsPath, "$destination/_astro", "--recursive", "--cache-control", "public,max-age=31536000,immutable")
  Invoke-Native -Command "aws" -Arguments @("s3", "cp", $astroAssetsPath, "$destination/_astro", "--recursive", "--exclude", "*", "--include", "*.css", "--cache-control", "public,max-age=31536000,immutable", "--content-type", "text/css; charset=utf-8")
}

$faviconPath = Join-Path $distNotes "favicon.svg"
if (Test-Path $faviconPath) {
  Invoke-Native -Command "aws" -Arguments @("s3", "cp", $faviconPath, "$destination/favicon.svg", "--cache-control", "public,max-age=31536000,immutable", "--content-type", "image/svg+xml")
}

if (-not $NoInvalidate) {
  $invalidation = Invoke-NativeJson -Command "aws" -Arguments @("cloudfront", "create-invalidation", "--distribution-id", $DistributionId, "--paths", "/$Prefix*", "/$Prefix/*")
  Write-Output "InvalidationId=$($invalidation.Invalidation.Id)"
}
