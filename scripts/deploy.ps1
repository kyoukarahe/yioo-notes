param(
  [string] $Bucket = "yioo-notes",
  [string] $DistributionId = "EWYEJXEIKC81C",
  [string] $Prefix = "notes",
  [switch] $SkipBuild,
  [switch] $NoInvalidate,
  [switch] $DryRun
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$distNotes = Join-Path $root "dist\notes"
$destination = "s3://$Bucket/$Prefix"
$commonArgs = @()

if ($DryRun) {
  $commonArgs += "--dryrun"
}

if (-not $SkipBuild) {
  Push-Location $root
  try {
    & npm.cmd run build
    & npm.cmd run verify:build
  }
  finally {
    Pop-Location
  }
}

if (-not (Test-Path $distNotes)) {
  throw "Missing build output: $distNotes"
}

& aws s3 sync $distNotes $destination --delete --cache-control "no-cache" @commonArgs

& aws s3 cp $distNotes $destination --recursive --exclude "*" --include "*.html" --cache-control "no-cache" --content-type "text/html; charset=utf-8" @commonArgs
& aws s3 cp $distNotes $destination --recursive --exclude "*" --include "*.json" --cache-control "no-cache" --content-type "application/json; charset=utf-8" @commonArgs
& aws s3 cp $distNotes $destination --recursive --exclude "*" --include "*.xml" --cache-control "no-cache" --content-type "application/xml; charset=utf-8" @commonArgs

$assetsPath = Join-Path $distNotes "assets"
if (Test-Path $assetsPath) {
  & aws s3 cp $assetsPath "$destination/assets" --recursive --cache-control "public,max-age=31536000,immutable" @commonArgs
}

$faviconPath = Join-Path $distNotes "favicon.svg"
if (Test-Path $faviconPath) {
  & aws s3 cp $faviconPath "$destination/favicon.svg" --cache-control "public,max-age=31536000,immutable" --content-type "image/svg+xml" @commonArgs
}

if (-not $NoInvalidate -and -not $DryRun) {
  $invalidation = & aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/$Prefix*" "/$Prefix/*" | ConvertFrom-Json
  Write-Output "InvalidationId=$($invalidation.Invalidation.Id)"
}
