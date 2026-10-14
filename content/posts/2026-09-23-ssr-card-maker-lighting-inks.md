---
title: "SSR 카드 메이커 빛·환경·잉크 가이드: 조명에 반응하는 카드"
slug: "2026-09-23-ssr-card-maker-lighting-inks"
date: "2026-09-23"
updated: "2026-10-14"
status: published
category: implementation
tags:
  - ssr-card-maker
  - guide
  - image-editing
summary: "주광·자외선·암실에서 진주광택·OVI·형광·인광 잉크가 어떻게 달라지는지 비교합니다. 축광량, 경과 시간과 적용 영역도 함께 살펴봅니다."
canonical: "/notes/2026-09-23-ssr-card-maker-lighting-inks/"
---

`카드 상세 → 빛·환경·잉크`에서는 **카드를 보는 조명 환경**과 **그 조명에 반응하는 잉크**를 고릅니다. 주광·자외선·암실에서 카드가 어떻게 달라지는지 확인할 수 있습니다. 포일의 반사 무늬와 색도 함께 두고 볼 수 있습니다.

[SSR 카드 메이커 열기](https://yioo.link/tools/ko/image/ssr-card-maker/) · [기본 사용법](/notes/2026-09-23-ssr-card-maker-guide/)

비교 이미지를 누르면 크게 볼 수 있습니다. 모바일에서 표가 화면보다 넓으면 표 안을 가로로 넘겨 보세요.

예시 카드의 캐릭터·배경, 전용 프레임, `Karahe` 제목과 하단 문구를 사용했습니다. 비교를 위해 용지·백색 인쇄·양각·음각·표면 마감과 별도의 포일 반사·텍스쳐를 껐습니다. 프레임·텍스트의 별도 홀로그램도 끈 상태입니다.

표의 **원본은 효과를 적용하기 전의 카드**입니다. 단독 잉크 예시는 강도 100%, 캐릭터·배경·프레임·텍스트 모두 선택, 동일한 권장 각도입니다. 차이를 보여 주려고 강도를 높여 촬영했으니, 직접 만들 때는 그림에 맞춰 조절하세요. 예외는 표에 적었습니다. 색·밝기·대비는 보정하지 않았습니다.

## 먼저 조명 환경을 고릅니다

잉크를 선택하지 않아도 `주광`, `자외선`, `암실`을 누를 수 있습니다. 현재 도구에서는 자외선·암실로 변경하면 잉크가 없는 카드도 어두워집니다. **조명 변경과 잉크 변경을 한꺼번에 비교하면 원인을 구분하기 어려우므로, 조명을 먼저 정한 뒤 같은 환경에서 잉크를 켜 보세요.**

### 주광 → 자외선

| 원본 · 주광, 잉크 없음 | 적용본 · 자외선, 잉크 없음 |
| --- | --- |
| [![주광에서 잉크 없는 카드](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-none-daylight.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-none-daylight.webp) | [![자외선에서 잉크 없는 카드](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-none-uv.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-none-uv.webp) |

이 단계에서는 잉크를 끈 채 조명만 자외선으로 변경했습니다. 잉크를 켰을 때의 발광은 아래 형광 잉크 예시에서 볼 수 있습니다.

### 주광 → 암실

| 원본 · 주광, 잉크 없음 | 적용본 · 암실, 잉크 없음 |
| --- | --- |
| [![주광에서 잉크 없는 카드](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-none-daylight.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-none-daylight.webp) | [![암실에서 잉크 없는 카드](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-none-dark.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-none-dark.webp) |

암실에서는 발광하지 않는 그림이 어두워집니다. 인광 잉크와 축광량을 함께 설정하면 어둠 속에서 빛나는 부분을 더할 수 있습니다.

### 편집 화면의 배경도 바뀝니다

| 원본 · 주광 편집 화면 | 적용본 · 자외선 편집 화면 |
| --- | --- |
| [![주광 편집 화면과 카드 바깥 배경](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-options/view-daylight.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-options/view-daylight.webp) | [![자외선 편집 화면과 보랏빛 배경](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-options/view-uv.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-options/view-uv.webp) |

| 원본 · 주광 편집 화면 | 적용본 · 암실 편집 화면 |
| --- | --- |
| [![주광 편집 화면](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-options/view-daylight.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-options/view-daylight.webp) | [![암실 편집 화면](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-options/view-dark.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-options/view-dark.webp) |

위 두 표는 **편집 화면 캡처**입니다. 카드 바깥의 작업 배경은 편집 화면에서 조명 환경을 알아보기 위한 표시입니다. 캡처는 정면·포인터 비활성 상태여서 앞의 권장 각도 PNG와 구도가 다릅니다. 표 안에서는 조명 모드만 변경했습니다.

## 특수 잉크

잉크는 **한 번에 하나**를 선택합니다. 포일이나 필름처럼 다른 메뉴의 효과와는 조합할 수 있습니다.

현재 형광·인광 잉크는 **캐릭터와 배경을 각각 업로드한 경우에만 목록에 나타납니다.** 배경이 포함된 그림 한 장을 올렸더라도, 두 업로드 영역에 각각 파일이 있어야 합니다. 이 가이드의 프로젝트에는 둘 다 들어 있습니다.

### 진주광택 잉크

| 원본 · 주광, 잉크 없음 | 적용본 · 진주광택 잉크 |
| --- | --- |
| [![진주광택 적용 전 카드](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-none-daylight.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-none-daylight.webp) | [![진주광택 잉크 100% 카드](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-pearl.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-pearl.webp) |

밝고 부드러운 반사와 은은한 색 변화를 더합니다. 주광에서도 효과가 나타나며, 이 예시에서는 머리카락·옷의 어두운 부분이 밝아지는 것이 잘 보입니다.

표면 마감의 `핫 포일 진주광택`과 이름은 비슷하지만 서로 다른 항목입니다. 이 표는 **잉크만** 켠 결과입니다.

### 광학가변 잉크 (OVI)

| 원본 · 주광, 잉크 없음 | 적용본 · OVI |
| --- | --- |
| [![OVI 적용 전 카드](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-none-daylight.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-none-daylight.webp) | [![OVI 100% 카드](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-ovi.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-ovi.webp) |

카드를 기울이는 방향에 따라 반사색이 달라지는 잉크 표현입니다. 이 각도에서는 보랏빛 변화가 넓게 나타납니다. 작은 무지개 띠를 여러 개 만드는 포일 반사와는 다른 인상입니다.

| 원본 · 가로 −7°, 세로 4° | 적용본 · 가로 +7°, 세로 4° |
| --- | --- |
| [![OVI 왼쪽 기울기](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ovi-angle-left.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ovi-angle-left.webp) | [![OVI 오른쪽 기울기](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ovi-angle-right.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ovi-angle-right.webp) |

두 장은 잉크와 환경 수치를 같게 두고 **가로 기울기만** 변경했습니다. 청록 계열과 보라 계열의 차이를 볼 수 있습니다. 앞의 OVI 단독 표와는 촬영 조건이 달라, 밝기는 이 두 장 안에서 비교하세요.

### 형광 잉크

| 원본 · 주광, 잉크 없음 | 적용본 · 주광, 형광 잉크 |
| --- | --- |
| [![주광 잉크 없음](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-none-daylight.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-none-daylight.webp) | [![주광 형광 잉크](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/fluor-daylight.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/fluor-daylight.webp) |

주광에서는 차이가 작습니다. 잉크를 골랐는데 변화가 잘 보이지 않으면 먼저 조명 환경을 확인하세요.

| 원본 · 자외선, 잉크 없음 | 적용본 · 자외선, 형광 잉크 |
| --- | --- |
| [![자외선 잉크 없음](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-none-uv.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/ink-none-uv.webp) | [![자외선 형광 잉크](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/fluor-uv.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/fluor-uv.webp) |

같은 자외선 환경에서 형광 잉크를 켜면 붉은 발광색이 뚜렷해집니다. 이 예시는 전 영역·강도 100%라 색 변화가 강합니다.

| 원본 · 주광의 형광 잉크 | 적용본 · 자외선의 형광 잉크 |
| --- | --- |
| [![형광 잉크 주광 상태](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/fluor-daylight.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/fluor-daylight.webp) | [![같은 형광 잉크 자외선 상태](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/fluor-uv.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/fluor-uv.webp) |

이 표는 잉크를 유지하고 조명만 변경한 모습입니다. 형광 잉크를 처음 시험할 때는 이 순서로 비교하면 반응을 구분하기 쉽습니다.

### 인광 잉크

| 원본 · 주광, 축광량 100% | 적용본 · 암실, 축광량 100% |
| --- | --- |
| [![인광 잉크 주광 상태](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/phosphor-daylight.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/phosphor-daylight.webp) | [![인광 잉크 암실 상태](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/phosphor-dark.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/phosphor-dark.webp) |

저장한 빛이 어둠 속에서 나오는 인상을 표현합니다. 이 예시에서는 청록빛이 강하게 드러납니다. 실제로 화면 앞에서 빛을 비추거나 기다릴 필요 없이 `축광량`과 `경과 시간`으로 상태를 정합니다.

## 환경 세부 조절

`환경 세부 조절`을 펼치면 선택한 잉크에 맞는 조절 항목이 활성화됩니다. **형광은 자외선 강도**, **인광은 어두움·축광량·경과 시간**을 확인하면 됩니다. 진주광택과 OVI에서는 이 잉크 반응용 조절 항목이 비활성화됩니다.

### 자외선 강도

| 원본 · 자외선 강도 0% | 적용본 · 자외선 강도 100% |
| --- | --- |
| [![자외선 모드 형광 잉크 UV 강도 0%](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/detail/fluor-uv-zero.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/detail/fluor-uv-zero.webp) | [![자외선 모드 형광 잉크 UV 강도 100%](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/detail/fluor-uv-full.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/detail/fluor-uv-full.webp) |

둘 다 **자외선 모드**입니다. 이 모드는 최소 자외선 반응을 유지하므로 슬라이더가 0%여도 형광이 완전히 꺼지지 않습니다. 반응 없는 상태와 비교하려면 `주광`으로 돌아가 자외선 강도도 0%로 맞추거나 잉크를 해제하세요.

### 축광량

| 원본 · 축광량 0% | 적용본 · 축광량 100% |
| --- | --- |
| [![암실 인광 잉크 축광량 0%](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/phosphor-empty.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/phosphor-empty.webp) | [![암실 인광 잉크 축광량 100%](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/phosphor-dark.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/phosphor-dark.webp) |

암실·경과 시간 0초에서 축광량만 변경했습니다. 인광 잉크를 골라도 저장된 빛이 없는 설정이면 강하게 빛나지 않습니다.

### 경과 시간

| 원본 · 경과 시간 0초 | 적용본 · 경과 시간 30초 |
| --- | --- |
| [![인광 잉크 경과 시간 0초](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/phosphor-dark.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/phosphor-dark.webp) | [![인광 잉크 경과 시간 30초](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/phosphor-after30.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/phosphor-after30.webp) |

같은 축광량에서 시간이 지난 상태를 선택하면 발광이 약해집니다. **이 값은 미리보기 시점**입니다. 위 오른쪽 사진은 슬라이더를 30초로 지정해 바로 확인한 결과입니다.

### 어두움

| 원본 · 어두움 0% | 적용본 · 어두움 100% |
| --- | --- |
| [![암실 모드 인광 잉크 어두움 0%](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/detail/phosphor-dark-zero.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/detail/phosphor-dark-zero.webp) | [![암실 모드 인광 잉크 어두움 100%](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/detail/phosphor-dark-full.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/detail/phosphor-dark-full.webp) |

둘 다 암실 모드·축광량 100%·경과 시간 0초입니다. 암실 모드도 최소 어두움 반응을 유지하므로 0%가 주광과 같지는 않습니다. 이 비교에서 차이는 축광량을 0%에서 100%로 변경할 때보다 작습니다.

## 적용 영역과 강도

| 원본 · 네 영역 모두 | 적용본 · 캐릭터만 |
| --- | --- |
| [![형광 잉크 전 영역 적용](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/fluor-uv-full.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/fluor-uv-full.webp) | [![형광 잉크 캐릭터만 적용](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/fluor-character.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-lighting-inks/light-package5-crops/full/fluor-character.webp) |

자외선 강도 100%·형광 잉크 강도 100%는 그대로 두고 적용 영역만 변경했습니다. 배경과 프레임을 제외하면 캐릭터의 발광이 더 구분됩니다. 선택하지 않은 영역도 **조명 환경에 따른 어두워짐**은 남을 수 있습니다.

`강도`는 잉크 효과가 드러나는 정도를 조절합니다. 전 영역 100%에서 원본 그림의 색이 너무 많이 바뀐다면 강도를 줄이거나 적용 영역을 좁혀 보세요. 영역을 확인하는 `영역 보기`와 그림 없이 재료 반응을 보는 `효과만 보기`는 다른 기능이며, 둘 다 작업 중 확인용입니다.

## 빛을 움직이는 방법

편집 화면에서는 카드 미리보기를 움직여 각도에 따른 반사를 살펴볼 수 있습니다. 보기 도구의 `포인터 반응`에서는 카드가 포인터 움직임에 바로 반응할지, 부드럽게 따라갈지 정합니다. `정면 빛 스윕`은 카드 방향을 정면으로 두고 빛이 훑는 모습을 확인하는 기능입니다.

**보기 도구의 재생과 저장할 연출은 따로 선택합니다.** PNG는 내보내기에서 각도 또는 정면의 빛 스윕 위치를 지정하고, GIF·WebP는 카드 회전과 빛 스윕 중 저장할 연출을 고릅니다. 잉크의 `경과 시간`은 이 애니메이션의 총 재생시간과 다른 값입니다.

## 변화가 잘 안 보일 때

- **형광·인광 선택지가 없음**: 캐릭터와 배경이 각각 업로드되었는지 확인합니다.
- **형광이 주광에서 거의 같음**: 자외선 모드로 변경하고 같은 환경의 잉크 없음과 비교합니다.
- **인광이 어두운 채로 남음**: 암실, 축광량, 경과 시간과 적용 영역을 확인합니다.
- **주광으로 돌아와도 처음과 다름**: 환경 수치가 남아 있는지 확인합니다. 모드 선택만으로 모든 슬라이더가 초기화되지는 않습니다.
- **텍스트·프레임과 그림의 변화가 다름**: 각 영역의 원래 색과 투명도, 선택된 적용 영역에 따라 차이가 납니다.

이 도구는 조명과 잉크의 인상을 디지털로 보여 줍니다. 실제 인쇄물의 형광색, 축광 지속시간과 색 변화 성능은 인쇄소의 사양과 견본으로 확인하세요.


## 함께 볼 가이드

[기본 사용법](/notes/2026-09-23-ssr-card-maker-guide/) · [인쇄 재질](/notes/2026-09-23-ssr-card-maker-print-materials/) · [포일](/notes/2026-09-23-ssr-card-maker-foil/) · [표면 마감](/notes/2026-09-23-ssr-card-maker-surface-finishes/) · [텍스트](/notes/2026-09-23-ssr-card-maker-text/)

---

> **AI disclosure**
>
> Final revision with OpenAI Codex using GPT-6 Astra (xhigh reasoning). Reviewed and edited by Yioo.
