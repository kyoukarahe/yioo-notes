---
title: "SSR 카드 메이커 텍스트 가이드: 문구, 포일 색과 표면 요철"
slug: "2026-09-23-ssr-card-maker-text"
date: "2026-09-23"
updated: "2026-10-14"
status: published
category: implementation
tags:
  - ssr-card-maker
  - guide
  - image-editing
summary: "제목과 설명문을 따로 편집하고 글꼴·배치·포일 색·표면 텍스쳐를 조절하는 방법을 안내합니다. 프레임 맞춤과 양각·음각의 사용 조건도 정리했습니다."
canonical: "/notes/2026-09-23-ssr-card-maker-text/"
---

`편집` 화면의 `텍스트 항목`에서 문구를 선택하면 **기본 설정**, **포일·빛**, **텍스처·요철** 탭이 나타납니다. 제목은 금빛으로, 하단 문구는 평범한 글자로 두는 것처럼 항목마다 다르게 설정할 수 있습니다.

[SSR 카드 메이커 열기](https://yioo.link/tools/ko/image/ssr-card-maker/) · [기본 사용법](/notes/2026-09-23-ssr-card-maker-guide/)

비교 이미지를 누르면 크게 볼 수 있습니다. 모바일에서 표가 화면보다 넓으면 표 안을 가로로 넘겨 보세요.

비교에는 캐릭터·배경 이미지와 전용 프레임을 넣은 카드를 사용했습니다. 제목은 `Karahe`, 하단은 `Custom holographic card`입니다. 비교표는 같은 위치를 잘랐으며 색·밝기·대비를 보정하지 않았습니다. 글자 효과는 카드 전체보다 제목 확대에서 잘 보입니다.

**원본은 각 표에서 비교할 설정을 변경하기 전의 카드**입니다. 글꼴·색·배치 표는 별도 홀로그램을 끄고 찍었습니다. 뒤의 재질 표는 빛을 켠 별도 조건이며, 표 사이의 서로 다른 기준 사진을 같은 설정으로 보지 않도록 구분했습니다.

## 문구별로 편집합니다

1. 왼쪽에서 편집할 문구를 선택합니다. 새 문구는 `텍스트 추가`로 만듭니다.
2. `기본 설정`에서 내용, 글꼴, 글자 색, 위치와 크기를 정합니다.
3. 반짝이는 글자를 원하면 `포일·빛`의 `홀로그램 재질`을 켭니다.
4. `텍스처·요철`에서 표면 무늬와 평면·양각·음각을 선택합니다.

`이 텍스트 숨기기`는 **선택한 항목만** 숨깁니다. 잠시 비교하려면 숨기기를 사용하고, 필요 없는 항목은 `삭제`로 지웁니다. **마지막 한 항목은 삭제할 수 없으므로, 문구가 없는 카드를 만들려면 그 항목을 숨기세요.** 제목과 하단 문구는 각각 편집합니다.

## 기본 설정

이 절의 기준 제목은 Cinzel, 크기 32px, 색 `#c4b7e6`, 가로 51%·세로 3.8%입니다. 예시 카드에 맞춰 정한 값입니다. 제품을 처음 열었을 때의 기본값과는 다릅니다.

### 글꼴

| 원본 · Cinzel | 적용본 · EB Garamond |
| --- | --- |
| [![Karahe 제목 Cinzel](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-base.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-base.webp) | [![같은 제목 EB Garamond](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-serif.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-serif.webp) |

글꼴만 변경해도 같은 문구의 폭과 인상이 달라집니다. 이름이 긴 제목은 글꼴을 먼저 고른 뒤 크기와 위치를 맞추는 편이 좋습니다. 이 표는 두 영문 글꼴을 비교한 예시입니다. 한글 문구의 모양은 직접 입력해 확인하세요.

목록에는 시스템 글꼴, Noto Sans KR·Noto Serif KR, Black Han Sans, 배민 도현·주아·연성, 마루부리 Bold, 함렛, Gmarket Sans Bold와 Cinzel·Cabin·Jost·EB Garamond 등이 있습니다. 처음 고르는 웹폰트는 다운로드가 끝난 뒤 모양을 확인하세요. 한글 제목으로 시작하려면 `나의 첫 카드`처럼 짧은 문구를 넣고 Noto Sans KR을 골라 보세요. 문구가 프레임 안에 들어가도록 크기를 맞춥니다.

### 기본 글자 색

| 원본 · 연보라 `#c4b7e6` | 적용본 · 노랑 `#ffe070` |
| --- | --- |
| [![연보라 기본 글자](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-base.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-base.webp) | [![노란 기본 글자](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-gold-color.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-gold-color.webp) |

이 색은 **글자 자체의 기본색**입니다. 뒤에서 고를 `포일 색상`과는 다릅니다. 여기서는 홀로그램을 껐으므로 색 변경만 볼 수 있습니다.

### 크기

| 원본 · 32px | 적용본 · 44px |
| --- | --- |
| [![제목 크기 32px](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-base.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-base.webp) | [![제목 크기 44px](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-size44.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-size44.webp) |

크기를 키운 뒤에는 제목 칸이나 프레임과 겹치지 않는지 확인합니다. 같은 수치여도 글꼴마다 차지하는 면적은 다릅니다.

### 위치

| 원본 · 세로 3.8% | 적용본 · 세로 10% |
| --- | --- |
| [![프레임 제목 칸에 놓인 문구](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/full/text-base.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/full/text-base.webp) | [![아래로 이동한 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/full/text-move.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/full/text-move.webp) |

가로·세로 위치를 조절해 프레임의 빈 공간에 맞춥니다. 위 오른쪽은 이동을 보여 주기 위한 예시입니다. 수치 입력으로 미세하게 맞추거나, 텍스트 편집 중 미리보기에서 글자를 잡고 옮길 수 있습니다.

프레임의 제목·설명 칸에 연결된 항목은 `프레임에 맞춤`으로 위치와 크기를 다시 맞출 수 있습니다. `텍스트 추가`로 만든 문구에는 프레임 연결이 없습니다. 원하는 위치와 크기로 배치하려면 직접 조절해야 합니다. 직접 올린 프레임 이미지도 문구를 넣을 자리를 확인하며 맞춰 주세요.

## 홀로그램 재질 켜기

이 절부터는 공통으로 **카드의 반사 패턴 강도 80%, 직접 반사광 40%, 주광·권장 각도**를 사용합니다. 카드 전체의 표면 텍스쳐는 `없음`, 프레임·하단 문구의 별도 홀로그램은 껐습니다. 제목만 비교합니다.

| 원본 · 제목 홀로그램 끔 | 적용본 · 제목 홀로그램 켬 |
| --- | --- |
| [![제목 홀로그램 비활성](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-optics-off.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-optics-off.webp) | [![제목 홀로그램 활성, 표면 텍스쳐 없음](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-optics-classic.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-optics-classic.webp) |

오른쪽은 평면·클래식 스펙트럼, 글자 면 반사 100%·반짝임 70%, 표면 텍스쳐 없음입니다. **이 조합과 각도에서는 켜기만 해서는 변화가 작습니다.** 흰빛과 테두리의 미묘한 차이를 볼 수 있습니다.

| 원본 · 표면 텍스쳐 없음 | 적용본 · 컨투어 100% |
| --- | --- |
| [![텍스쳐 없는 홀로그램 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-optics-classic.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-optics-classic.webp) | [![컨투어 텍스쳐 100% 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp) |

같은 글자에 컨투어를 선택하고 텍스쳐 강도를 100%로 높이면 글자 안쪽의 색 반사가 훨씬 잘 드러납니다. 반짝임이 약하게 느껴질 때는 홀로그램 체크 여부뿐 아니라 **텍스쳐, 강도, 빛의 위치**를 함께 확인하세요.

## 포일 색상

아래 팔레트 표는 모두 **평면·컨투어 100%, 밀도 100%·각도 0°, 글자 면 반사 100%·반짝임 70%**입니다. 작은 제목에서 색 차이를 보여 주기 위한 조건이며, 항상 이렇게 강하게 쓸 필요는 없습니다. 왼쪽은 클래식 스펙트럼입니다.

### 소프트 오로라

| 원본 · 클래식 스펙트럼 | 적용본 · 소프트 오로라 |
| --- | --- |
| [![클래식 스펙트럼 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp) | [![소프트 오로라 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-aurora.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-aurora.webp) |

민트·보라·분홍 계열의 색 조합입니다. 같은 무늬를 유지하면서 반사색의 인상을 변경합니다.

### 코스믹 더스트

| 원본 · 클래식 스펙트럼 | 적용본 · 코스믹 더스트 |
| --- | --- |
| [![클래식 스펙트럼 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp) | [![코스믹 더스트 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-cosmic.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-cosmic.webp) |

보라·청록·주황 계열을 사용합니다. 무늬는 표면 텍스쳐에서 고릅니다.

### 길디드 래티스

| 원본 · 클래식 스펙트럼 | 적용본 · 길디드 래티스 |
| --- | --- |
| [![클래식 스펙트럼 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp) | [![길디드 래티스 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-gilded.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-gilded.webp) |

노랑·금색·따뜻한 주황 쪽으로 인상이 달라집니다. 이 표에서는 금빛 변화가 비교적 쉽게 보입니다.

### 프리즘 블룸

| 원본 · 클래식 스펙트럼 | 적용본 · 프리즘 블룸 |
| --- | --- |
| [![클래식 스펙트럼 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp) | [![프리즘 블룸 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-prism.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-prism.webp) |

분홍·시안·연두 계열을 조합합니다. 글자마다 어떤 색이 보이는지는 빛의 위치와 텍스쳐에 따라 달라집니다.

### 풀 스펙트럼

| 원본 · 클래식 스펙트럼 | 적용본 · 풀 스펙트럼 |
| --- | --- |
| [![클래식 스펙트럼 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp) | [![풀 스펙트럼 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-full.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-full.webp) |

여러 원색의 무지개 반사를 고를 때 비교할 수 있는 팔레트입니다. 이름에 관계없이 사진 한 장에서 모든 색이 같은 비율로 보이지는 않습니다.

### 래디언트 라인

| 원본 · 클래식 스펙트럼 | 적용본 · 래디언트 라인 |
| --- | --- |
| [![클래식 스펙트럼 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp) | [![래디언트 라인 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-radiant.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-radiant.webp) |

주황·파랑·보라 계열의 조합입니다. 이것도 색상 선택이므로, 선 무늬 자체를 변경하고 싶다면 표면 텍스쳐를 함께 확인합니다.

### 렐릭 웨이브

| 원본 · 클래식 스펙트럼 | 적용본 · 렐릭 웨이브 |
| --- | --- |
| [![클래식 스펙트럼 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp) | [![렐릭 웨이브 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-relic.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-relic.webp) |

황록·청록·주황 계열을 사용합니다. 팔레트 변경은 글꼴이나 글자의 외곽선을 변경하지 않습니다.

### 에너지 플럭스

| 원본 · 클래식 스펙트럼 | 적용본 · 에너지 플럭스 |
| --- | --- |
| [![클래식 스펙트럼 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp) | [![에너지 플럭스 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-energy.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-energy.webp) |

초록·파랑·분홍 계열의 조합입니다. 카드 전체와 같은 반사색을 따라가게 하려면 고정 팔레트 대신 `카드 팔레트 상속`을 고를 수 있습니다. 기본 글자색은 유지됩니다.

### 실버와 사용자 색상

| 원본 · 클래식 스펙트럼 | 적용본 · 실버 |
| --- | --- |
| [![클래식 스펙트럼 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp) | [![실버 선택 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-silver.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-silver.webp) |

| 원본 · 클래식 스펙트럼 | 적용본 · 사용자 색상 `#e8b947` |
| --- | --- |
| [![클래식 스펙트럼 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp) | [![사용자 포일 색상 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-custom.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-color100-custom.webp) |

실버는 은색 계열의 반사색을, 사용자 색상은 직접 고른 반사색을 사용합니다. 다만 **이번처럼 텍스쳐 반사가 강한 조합에서는 무지개색이 남습니다.** 단순한 글자색 변경은 기본 설정의 `글자 색`을 사용하세요.

## 글자 면 반사와 반짝임

이 절은 컨투어 강도 **40%**에서 비교합니다. 팔레트 표의 100%와 다르므로 글자 색이 더 은은합니다.

| 원본 · 글자 면 반사 25% | 적용본 · 글자 면 반사 100% |
| --- | --- |
| [![글자 면 반사 25%](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-face25.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-face25.webp) | [![글자 면 반사 100%](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-contour40.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-contour40.webp) |

글자 면 반사는 재질 반사가 글자에 드러나는 정도를 조절합니다. 기본 글자색과 불투명도는 유지됩니다. 위 표는 반짝임을 70%로 고정했습니다.

| 원본 · 반짝임 0% | 적용본 · 반짝임 70% |
| --- | --- |
| [![텍스트 반짝임 0%](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-sparkle0.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-sparkle0.webp) | [![텍스트 반짝임 70%](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-contour40.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-contour40.webp) |

반짝임은 밝은 하이라이트가 드러나는 정도를 조절합니다. 이 제목과 각도에서는 차이가 작습니다. 한 장의 사진에서 잘 안 보이면 빛을 글자 쪽으로 움직이며 확인하세요.

## 텍스처·요철

### 평면·양각·음각

| 일반 · 평면 | 양각 | 음각 |
| --- | --- | --- |
| [![평면 컨투어 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp) | [![양각 컨투어 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-raised100.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-raised100.webp) | [![음각 컨투어 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-inset100.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-inset100.webp) |

컨투어 강도는 100%입니다. 양각·음각의 형상 깊이는 100%, 측벽 부드러움은 42%로 맞췄습니다. 평면에는 이 두 요철 설정이 적용되지 않습니다. 양각은 솟은 글자, 음각은 파인 글자의 가장자리 반응을 표현합니다. 카드 전체에 적용하는 인쇄 재질의 양각·음각과 달리 **선택한 글자 모양**을 기준으로 합니다.

이 크기의 제목에서는 세 결과의 차이가 작고, 강한 색 무늬에 경계의 차이가 가려지기도 합니다. 카드를 기울이며 글자 테두리의 밝고 어두운 방향을 살펴보세요.

### 형상 깊이와 측벽 부드러움

두 설정은 `홀로그램 재질`을 켜고 **양각 또는 음각**을 선택해야 조절할 수 있습니다. 평면에서는 비활성화됩니다.

| 원본 · 음각 깊이 25% | 적용본 · 음각 깊이 100% |
| --- | --- |
| [![음각 형상 깊이 25%](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-inset-depth25.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-inset-depth25.webp) | [![음각 형상 깊이 100%](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-inset40.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-inset40.webp) |

컨투어 강도 40%에서 비교했습니다. 깊이는 화면에 표현되는 요철의 시각 반응을 조절하는 값입니다.

| 원본 · 측벽 부드러움 42% | 적용본 · 측벽 부드러움 100% |
| --- | --- |
| [![음각 측벽 부드러움 42%](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-inset40.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-inset40.webp) | [![음각 측벽 부드러움 100%](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-inset-soft100.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-inset-soft100.webp) |

글자 가장자리의 빛과 그림자가 얼마나 부드럽게 이어지는지 조절합니다. 작은 글자에서는 차이가 미묘하므로, 제목을 크게 보거나 빛을 움직이며 판단하세요.

### 텍스트만의 표면 텍스쳐

| 원본 · 컨투어 | 적용본 · 체브론 |
| --- | --- |
| [![컨투어 제목 텍스쳐](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp) | [![체브론 제목 텍스쳐](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-chevron.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-chevron.webp) |

| 원본 · 컨투어 | 적용본 · 방사형 |
| --- | --- |
| [![컨투어 제목 텍스쳐](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp) | [![방사형 제목 텍스쳐](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-radial.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-radial.webp) |

모두 텍스쳐 강도 100%입니다. 카드 전체와 다른 텍스쳐를 제목에만 지정할 수 있습니다. 글자는 좁은 면적이므로 카드 전체에서 보던 큰 무늬보다 작은 반사 조각으로 보일 수 있습니다.

`카드 텍스처 상속`은 카드 전체의 텍스쳐를 따라가고, `없음`은 글자 표면의 해당 무늬를 끕니다. 새 텍스쳐는 `텍스쳐 업로드`로 추가할 수 있습니다.

| 원본 · 컨투어 40% | 적용본 · 사용자 텍스쳐 40% |
| --- | --- |
| [![컨투어 텍스쳐 40%](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-contour40.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-contour40.webp) | [![Satin-Weave 사용자 텍스쳐](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-custom-texture.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-custom-texture.webp) |

오른쪽은 프로젝트 ZIP에서 복원한 커스텀 텍스쳐 `Satin-Weave`를 선택했습니다.

### 강도·밀도·각도

| 원본 · 텍스쳐 강도 40% | 적용본 · 텍스쳐 강도 100% |
| --- | --- |
| [![텍스쳐 강도 40% 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-contour40.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-contour40.webp) | [![텍스쳐 강도 100% 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-texture-contour.webp) |

이 카드에서는 강도에 따른 차이가 큽니다. 글자가 너무 화려해져 읽기 어려우면 포일 색을 변경하기 전에 텍스쳐 강도를 낮춰 보세요.

| 원본 · 밀도 100% | 적용본 · 밀도 200% |
| --- | --- |
| [![텍스쳐 밀도 100% 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-contour40.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-contour40.webp) | [![텍스쳐 밀도 200% 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-density200.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-density200.webp) |

밀도는 무늬의 촘촘함을 변경합니다. 이 표는 강도 40%라 변화가 은은합니다. 밀도를 높이면 작은 글자에서는 무늬가 지나치게 잘게 보일 수도 있습니다.

| 원본 · 각도 0° | 적용본 · 각도 90° |
| --- | --- |
| [![텍스쳐 각도 0도 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-contour40.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-contour40.webp) | [![텍스쳐 각도 90도 제목](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-angle90.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-text/text-package5-crops/detail/text-angle90.webp) |

이 각도는 **표면 무늬의 방향**을 변경합니다. 글자와 카드의 방향은 유지됩니다. 빛 띠의 방향은 포일 메뉴의 `반사 띠 각도`에서 조절합니다.

## 마무리 확인

- 제목과 설명문이 모두 읽히는지 카드 전체 크기로 돌아가 확인합니다.
- 글자색과 포일 색, 표면 텍스쳐를 한 번에 변경하기보다 하나씩 비교합니다.
- 텍스쳐를 조절하려면 `홀로그램 재질`을 켜야 합니다. 형상 깊이·측벽 부드러움까지 조절하려면 양각이나 음각도 선택해야 합니다.
- 편집 화면에서 보던 반사를 저장하려면 PNG 내보내기의 각도 또는 정면 빛 스윕 위치도 확인합니다.
- 나중에 문구를 다시 편집하려면 프로젝트 정보가 들어 있는 ZIP을 함께 보관합니다. PNG의 글자는 편집 가능한 텍스트 항목으로 남지 않습니다.

이 가이드의 요철과 반사는 디지털 표현입니다. 실제 금박·은박이나 음각 인쇄의 색상과 깊이는 인쇄소의 견본으로 확인하세요.


## 함께 볼 가이드

[기본 사용법](/notes/2026-09-23-ssr-card-maker-guide/) · [인쇄 재질](/notes/2026-09-23-ssr-card-maker-print-materials/) · [포일](/notes/2026-09-23-ssr-card-maker-foil/) · [표면 마감](/notes/2026-09-23-ssr-card-maker-surface-finishes/) · [빛·환경·잉크](/notes/2026-09-23-ssr-card-maker-lighting-inks/)

---

> **AI disclosure**
>
> Final revision with OpenAI Codex using GPT-6 Astra (xhigh reasoning). Reviewed and edited by Yioo.
