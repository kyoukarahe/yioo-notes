---
title: "SSR 카드 메이커 포일 가이드: 반사 모양, 무지개빛, 표면 텍스쳐"
slug: "2026-09-23-ssr-card-maker-foil"
date: "2026-09-23"
updated: "2026-10-14"
status: published
category: implementation
tags:
  - ssr-card-maker
  - guide
  - image-editing
summary: "포일 프리셋과 반사 방식, 반사 색상, 표면 텍스쳐의 차이를 이미지로 비교하고 강도·밀도·각도와 대상별 설정을 설명합니다."
canonical: "/notes/2026-09-23-ssr-card-maker-foil/"
---

`카드 상세 → 포일`에서는 카드가 빛을 받았을 때 나타나는 반사와 잔무늬를 고릅니다. 넓게 지나가는 빛의 모양과, 그 빛을 받아 드러나는 표면 텍스쳐를 따로 변경할 수 있습니다.

[SSR 카드 메이커 열기](https://yioo.link/tools/ko/image/ssr-card-maker/) · [기본 사용법](/notes/2026-09-23-ssr-card-maker-guide/)

비교 이미지를 누르면 크게 볼 수 있습니다. 모바일에서 표가 화면보다 넓으면 표 안을 가로로 넘겨 보세요.

각 표의 **원본은 비교할 설정을 변경하기 전의 카드**입니다. 업로드한 그림에 프레임과 문구까지 배치한 상태입니다. 예시 카드의 캐릭터·배경, 전용 프레임, `Karahe` 제목과 하단 문구를 사용했습니다. 용지·백색 인쇄·특수 잉크·코팅·양각·음각은 끄고, 프레임과 글자의 별도 홀로그램도 대상별 예시 전까지는 껐습니다.

모든 저장 이미지는 같은 권장 각도와 주광 환경입니다. 한 장에 담기는 것은 한 각도의 모습이므로, 움직일 때의 반사 변화까지 보여 주지는 않습니다.

## 먼저 구분하기

- **포일 프리셋**: 반사 패턴·색·텍스쳐·강도를 함께 고르는 조합입니다.
- **반사 방식**: 넓은 반사 띠, 가는 선, 교차 반사 등 빛 반응의 종류입니다.
- **반사 패턴**: 반사가 흐르는 바탕 모양입니다. 잔무늬를 고르는 표면 텍스쳐와는 다릅니다.
- **반사 색상과 스펙트럼**: `반사 색상`에서 고르는 빛의 색 조합입니다. 원본 그림과 글자의 기본색은 유지됩니다.
- **표면 텍스쳐**: 빛을 받았을 때 드러나는 작은 선이나 격자 무늬입니다.

처음에는 프리셋을 고른 뒤 반사 방식과 표면 텍스쳐를 한 가지씩 변경해 보면 차이를 구분하기 쉽습니다. 금속성 재료나 필름을 변경하려면 [표면 마감 가이드](/notes/2026-09-23-ssr-card-maker-surface-finishes/)를 참고하세요. `홀로그램 재료`도 그 메뉴에 있습니다.

## 포일 프리셋

어디서 시작할지 망설여지면 `클래식`의 굽은 선, `디프랙션`의 V자 결, `프리즈매틱`의 방사형 결을 먼저 비교해 보세요. 원하는 무늬를 고른 뒤 `반사 설정`에서 빛의 움직임을 변경하면 됩니다.

아래 표의 왼쪽은 반사 패턴 강도·직접 반사광을 0%로 하고 표면 텍스쳐를 뺀 카드입니다. 오른쪽은 프리셋을 적용한 결과입니다. **프리셋은 여러 설정을 함께 변경합니다.**

현재 포일 프리셋은 반사 방식을 자동으로 변경하지 않습니다. 아래 예시도 모두 `기본 반사`로 고정했습니다. 일부 이름 옆의 ‘추천’은 함께 사용하기 좋은 반사 방식이며, 원하는 경우 `반사 설정`에서 따로 선택합니다.

### 클래식

| 원본 | 적용본 |
| --- | --- |
| [![포일 효과를 끈 기준 카드](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp) | [![클래식 포일 프리셋](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/preset-classic.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/preset-classic.webp) |

완만한 반사에 등고선 같은 `컨투어` 텍스쳐를 더한 기본 조합입니다. 어두운 옷과 머리카락에서 굽이치는 잔선을 확인할 수 있습니다.

### 디프랙션

| 원본 | 적용본 |
| --- | --- |
| [![포일 효과를 끈 기준 카드](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp) | [![디프랙션 포일 프리셋](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/preset-diffraction.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/preset-diffraction.webp) |

대각 방향의 반사 패턴과 V자 모양의 체브론 텍스쳐를 묶은 조합입니다.

### 프리즈매틱

| 원본 | 적용본 |
| --- | --- |
| [![포일 효과를 끈 기준 카드](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp) | [![프리즈매틱 포일 프리셋](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/preset-prismatic.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/preset-prismatic.webp) |

방사형 반사와 텍스쳐를 함께 사용합니다. 클래식의 굽은 선과 달리, 선이 한 방향으로 모이거나 퍼지는 인상이 생깁니다.

### 리버스 격자

| 원본 | 적용본 |
| --- | --- |
| [![포일 효과를 끈 기준 카드](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp) | [![리버스 격자 포일 프리셋, 기본 반사](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/preset-reverse-lattice.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/preset-reverse-lattice.webp) |

촘촘한 격자와 금빛 계열의 반사색을 조합합니다. 추천 반사 방식은 `리버스 필드`입니다. 위 이미지는 추천 방식을 추가하지 않은 프리셋 자체의 결과입니다.

### 홀로 스캔

| 원본 | 적용본 |
| --- | --- |
| [![포일 효과를 끈 기준 카드](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp) | [![홀로 스캔 포일 프리셋, 기본 반사](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/preset-holo-scan.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/preset-holo-scan.webp) |

촘촘한 선 무늬와 부드러운 오로라 계열 색을 사용합니다. 추천 반사 방식인 `홀로포일`을 별도로 고르면 가는 선 형태의 빛 반응도 더할 수 있습니다.

### 프리즘 더스트

| 원본 | 적용본 |
| --- | --- |
| [![포일 효과를 끈 기준 카드](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp) | [![프리즘 더스트 포일 프리셋, 기본 반사](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/preset-prism-dust.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/preset-prism-dust.webp) |

컨투어를 조금 크게 쓰고, 보라·청록 계열의 반사와 조합합니다. 입자 반응을 더하려면 추천 방식인 `어메이징 프리즘`을 선택합니다.

### 래디언트 포커스

| 원본 | 적용본 |
| --- | --- |
| [![포일 효과를 끈 기준 카드](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp) | [![래디언트 포커스 포일 프리셋, 기본 반사](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/preset-radiant-focus.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/preset-radiant-focus.webp) |

방사형 텍스쳐의 밀도를 낮춰 선의 흐름을 크게 보여 주는 조합입니다. 추천 반사 방식은 `래디언트 스펙트럼`입니다.

### V 크로스

| 원본 | 적용본 |
| --- | --- |
| [![포일 효과를 끈 기준 카드](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp) | [![V 크로스 포일 프리셋, 기본 반사](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/preset-v-cross.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/preset-v-cross.webp) |

기울어진 체브론 무늬와 녹색·파랑·자홍 계열을 조합합니다. 추천 반사 방식인 `V 스펙트럼`은 따로 선택하며, 교차하는 빛 반응은 그쪽에서 확인할 수 있습니다.

## 반사 방식

`반사 설정`에서 선택합니다. 여기서는 텍스쳐를 꺼서 넓은 빛 반응을 비교했습니다. 첫 표 이후의 왼쪽은 **기본 반사가 이미 적용된 카드**입니다.

### 기본 반사

| 원본 · 포일 효과 없음 | 적용본 · 기본 반사 |
| --- | --- |
| [![포일 효과 없음](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/foil-off.webp) | [![기본 반사, 표면 텍스쳐 없음](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp) |

카드를 가로지르는 넓은 반사 띠와 광원 주변의 밝기를 만듭니다. 잔무늬 없이 빛만 남겨도, 색이 고른 옷이나 어두운 머리카락에서 밝아지는 영역을 볼 수 있습니다.

### 리버스 필드

| 원본 · 기본 반사 | 적용본 · 리버스 필드 |
| --- | --- |
| [![기본 반사](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp) | [![리버스 필드](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-reverse-field.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-reverse-field.webp) |

넓은 면의 반사 강도와 띠의 분포를 변경합니다. 이번 조건에서는 기본 반사와의 차이가 비교적 은은합니다.

### 홀로포일

| 원본 · 기본 반사 | 적용본 · 홀로포일 |
| --- | --- |
| [![기본 반사](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp) | [![홀로포일](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-holofoil.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-holofoil.webp) |

넓은 반사와 함께 가는 선 형태의 빛이 나타납니다. 이 예시에서는 옷과 머리카락 위에 반복되는 세로 결이 두드러집니다. 표면 텍스쳐를 넣지 않아도 반사 방식 자체에서 생기는 선입니다.

### 어메이징 프리즘

| 원본 · 기본 반사 | 적용본 · 어메이징 프리즘 |
| --- | --- |
| [![기본 반사](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp) | [![어메이징 프리즘](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-amazing-prism.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-amazing-prism.webp) |

여러 방향의 반사와 작은 입자 반응을 섞습니다. 고르게 흐르는 띠보다 부분적으로 반짝이는 인상을 만들 때 사용할 수 있습니다. 입자의 크기가 작아 축소된 카드에서는 차이가 약하게 보일 수 있습니다.

### 래디언트 스펙트럼

| 원본 · 기본 반사 | 적용본 · 래디언트 스펙트럼 |
| --- | --- |
| [![기본 반사](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp) | [![래디언트 스펙트럼](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-radiant-spectrum.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-radiant-spectrum.webp) |

서로 다른 방향의 색 반사를 겹쳐 보여 줍니다. 고정된 격자 모양이 필요하면 뒤의 표면 텍스쳐에서 `래디언트 격자`를 선택합니다.

### V 스펙트럼

| 원본 · 기본 반사 | 적용본 · V 스펙트럼 |
| --- | --- |
| [![기본 반사](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp) | [![V 스펙트럼](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-v-spectrum.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-v-spectrum.webp) |

여러 반사 띠가 교차하는 방향성을 강조합니다. ‘V자 무늬’를 카드에 고정하는 체브론 텍스쳐와는 별개입니다. 카드를 움직이면 띠가 겹치는 위치와 색도 달라집니다.

## 반사 패턴

반사 방식이 빛 반응의 종류라면, 반사 패턴은 그 반사가 흐르는 바탕 모양입니다. 아래는 `기본 반사`, 표면 텍스쳐 없음으로 고정하고 패턴만 변경한 결과입니다.

### 클린 크로싱에서 대각 흐름으로

| 원본 · 클린 크로싱 | 적용본 · 대각 흐름 |
| --- | --- |
| [![클린 크로싱 반사 패턴](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp) | [![대각 흐름 반사 패턴](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/field-diagonal.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/field-diagonal.webp) |

기본인 클린 크로싱은 완만하게 교차하는 바탕을 사용합니다. 대각 흐름은 사선 방향의 흐름을 만듭니다. 패턴을 고른 뒤 강도나 반사 띠 각도를 조절할 수 있습니다.

### 클린 크로싱에서 방사 팬으로

| 원본 · 클린 크로싱 | 적용본 · 방사 팬 |
| --- | --- |
| [![클린 크로싱 반사 패턴](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp) | [![방사 팬 반사 패턴](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/field-radial.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/field-radial.webp) |

한곳에서 퍼지는 방향의 반사 바탕입니다. 같은 이름 계열의 방사형 텍스쳐와 함께 쓸 수 있지만, 두 항목은 독립적으로 선택할 수 있습니다.

## 반사 색상과 스펙트럼

아래는 카드 가운데의 같은 부분을 확대한 비교입니다. 왼쪽은 모두 `클래식 스펙트럼`, 오른쪽은 선택한 색상 스펙트럼입니다. 표면 텍스쳐는 껐습니다.

색 조합마다 반사가 강조되는 정도도 조금 다릅니다. 원래 그림의 색이 강하면 차이가 은은할 수 있으며, 모든 색이 한 장에 동시에 나타나지는 않습니다.

### 소프트 오로라

| 원본 · 클래식 스펙트럼 | 적용본 |
| --- | --- |
| [![클래식 스펙트럼 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp) | [![소프트 오로라 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/palette-soft-aurora.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/palette-soft-aurora.webp) |

민트·연보라·분홍 계열의 부드러운 조합입니다. 원래 그림의 분위기를 크게 변경하지 않고 은은한 색 반사를 더할 때 비교해 볼 수 있습니다.

### 코스믹 더스트

| 원본 · 클래식 스펙트럼 | 적용본 |
| --- | --- |
| [![클래식 스펙트럼 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp) | [![코스믹 더스트 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/palette-cosmic-dust.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/palette-cosmic-dust.webp) |

보라·청록에 따뜻한 주황 계열이 섞인 반사색 조합입니다.

### 길디드 래티스

| 원본 · 클래식 스펙트럼 | 적용본 |
| --- | --- |
| [![클래식 스펙트럼 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp) | [![길디드 래티스 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/palette-gilded-lattice.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/palette-gilded-lattice.webp) |

금색·황록·붉은 갈색 계열의 반사색입니다. 금속 장식과 맞추기 좋은 선택지지만, 격자 모양은 별도 텍스쳐로 골라야 합니다.

### 프리즘 블룸

| 원본 · 클래식 스펙트럼 | 적용본 |
| --- | --- |
| [![클래식 스펙트럼 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp) | [![프리즘 블룸 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/palette-prism-bloom.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/palette-prism-bloom.webp) |

분홍·시안·연두 계열을 사용합니다. 따뜻한 금속색보다 밝은 색 반사를 원할 때 비교해 볼 수 있습니다.

### 풀 스펙트럼

| 원본 · 클래식 스펙트럼 | 적용본 |
| --- | --- |
| [![클래식 스펙트럼 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp) | [![풀 스펙트럼 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/palette-full-spectrum.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/palette-full-spectrum.webp) |

빨강·시안·노랑을 포함한 선명한 반사색 조합입니다. 이 각도와 그림에서는 변화가 작게 보이는 부분도 있습니다.

### 래디언트 라인

| 원본 · 클래식 스펙트럼 | 적용본 |
| --- | --- |
| [![클래식 스펙트럼 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp) | [![래디언트 라인 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/palette-radiant-lines.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/palette-radiant-lines.webp) |

주황·파랑·보라 계열의 반사색 조합입니다.

### 렐릭 웨이브

| 원본 · 클래식 스펙트럼 | 적용본 |
| --- | --- |
| [![클래식 스펙트럼 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp) | [![렐릭 웨이브 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/palette-relic-wave.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/palette-relic-wave.webp) |

황록·청록·산호색 계열을 사용합니다. 차갑고 따뜻한 색이 함께 있는 조합입니다.

### 에너지 플럭스

| 원본 · 클래식 스펙트럼 | 적용본 |
| --- | --- |
| [![클래식 스펙트럼 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp) | [![에너지 플럭스 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/palette-energy-flux.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/palette-energy-flux.webp) |

녹색·파랑·자홍 계열의 조합입니다. 네온 계열 그림과 어울릴 수 있지만, 원본부터 색이 강한 카드에서는 움직이며 비교하는 편이 구분하기 쉽습니다.

## 세부 반사 조절

`반사 설정 → 세부 반사 조절`의 베이스라인·디프랙션·프리즈매틱은 **같은 텍스쳐가 빛을 받는 세부 반응**을 변경합니다. 앞에서 본 같은 이름의 디프랙션 프리셋을 선택하면 텍스쳐도 함께 바뀝니다. 아래에서는 클래식의 컨투어 텍스쳐와 나머지 값을 유지했습니다.

### 베이스라인에서 디프랙션으로

| 원본 · 베이스라인 | 적용본 · 디프랙션 |
| --- | --- |
| [![베이스라인 반응 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/preset-classic.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/preset-classic.webp) | [![디프랙션 반응 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/response-diffraction.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/response-diffraction.webp) |

같은 컨투어 무늬를 유지하면서 반사 띠와 그 주변의 색 전환을 다르게 표현합니다.

### 베이스라인에서 프리즈매틱으로

| 원본 · 베이스라인 | 적용본 · 프리즈매틱 |
| --- | --- |
| [![베이스라인 반응 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/preset-classic.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/preset-classic.webp) | [![프리즈매틱 반응 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/response-prismatic.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/response-prismatic.webp) |

텍스쳐 결에서 드러나는 색 반응을 변경합니다. 두 모드 모두 작은 차이를 다루므로, 큰 형태를 변경하려면 반사 방식이나 반사 패턴을 먼저 변경하는 편이 빠릅니다.

## 반사 강도와 각도

### 반사 패턴 강도

| 원본 · 20% | 적용본 · 100% |
| --- | --- |
| [![반사 패턴 강도 20%](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/strength-field-20.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/strength-field-20.webp) | [![반사 패턴 강도 100%](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/strength-field-100.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/strength-field-100.webp) |

선택한 반사 패턴이 드러나는 세기를 조절합니다. 여기서는 텍스쳐를 꺼 두었습니다. 직접 반사광은 별도 설정값을 유지합니다.

### 직접 반사광

| 원본 · 0% | 적용본 · 100% |
| --- | --- |
| [![직접 반사광 0%](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/strength-glare-0.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/strength-glare-0.webp) | [![직접 반사광 100%](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/strength-glare-100.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/strength-glare-100.webp) |

광원을 받는 부분의 밝은 반사를 조절합니다. 빛이 닿는 위치에 따라 밝아지는 정도가 달라집니다.

### 반사 띠 각도

| 원본 · 0도 | 적용본 · 90도 |
| --- | --- |
| [![반사 띠 각도 0도](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-review-2026-10-14/full/band-0.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-review-2026-10-14/full/band-0.webp) | [![반사 띠 각도 90도](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-review-2026-10-14/full/band-90.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-review-2026-10-14/full/band-90.webp) |

빛 띠의 방향을 변경합니다. 카드의 기울기나 그림의 방향은 그대로입니다. 표면 텍스쳐의 무늬까지 돌리고 싶다면 텍스쳐 각도를 따로 조절합니다.

### 상세 반응 강도

| 원본 · 0% | 적용본 · 100% |
| --- | --- |
| [![상세 반응 강도 0% 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/strength-response-0.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/strength-response-0.webp) | [![상세 반응 강도 100% 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/strength-response-100.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/strength-response-100.webp) |

선택한 세부 반사 반응의 세기를 조절합니다. 전체 포일의 켜기·끄기와는 다르므로, 0%에서도 다른 반사 성분은 남을 수 있습니다.

## 표면 텍스쳐

`표면 텍스쳐 → 카드 전체`에서 선택합니다. 아래는 **반사는 유지하고 텍스쳐만 뺀 카드**를 왼쪽에 두었습니다. 오른쪽은 텍스쳐 강도 70%, 밀도 100%, 각도 0도로 통일했습니다.

별도 요철을 만드는 인쇄 재질의 양각·음각과 달리, 빛에 반응하는 작은 표면 무늬입니다. 이 예시의 캐릭터와 배경은 카드 전체 설정을 따릅니다.

### 컨투어

| 원본 · 텍스쳐 없음 | 적용본 · 컨투어 |
| --- | --- |
| [![텍스쳐 없음 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp) | [![컨투어 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/preset-classic.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/preset-classic.webp) |

등고선처럼 굽이치는 선 무늬입니다. 평평한 색 면에서 결이 잘 드러나며, 기본 클래식 프리셋에 들어 있습니다.

### 체브론

| 원본 · 텍스쳐 없음 | 적용본 · 체브론 |
| --- | --- |
| [![텍스쳐 없음 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp) | [![체브론 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/texture-chevron.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/texture-chevron.webp) |

V자와 지그재그가 반복되는 무늬입니다. 반사 띠와 별개로 카드 표면에 고정된 반복 방향을 만듭니다.

### 방사형

| 원본 · 텍스쳐 없음 | 적용본 · 방사형 |
| --- | --- |
| [![텍스쳐 없음 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp) | [![방사형 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/texture-radial.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/texture-radial.webp) |

한 점을 중심으로 퍼지는 선 결입니다. 반사 패턴의 방사 팬은 넓은 빛 분포를, 이 텍스쳐는 작은 선 무늬를 담당합니다.

### 래디언트 격자

| 원본 · 텍스쳐 없음 | 적용본 · 래디언트 격자 |
| --- | --- |
| [![텍스쳐 없음 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp) | [![래디언트 격자 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/texture-radiant-lattice.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/texture-radiant-lattice.webp) |

선이 교차하는 격자 무늬입니다. 격자의 간격은 텍스쳐 밀도로 변경합니다.

### 홀로 스캔

| 원본 · 텍스쳐 없음 | 적용본 · 홀로 스캔 |
| --- | --- |
| [![텍스쳐 없음 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/family-standard.webp) | [![홀로 스캔 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/texture-holo-scan.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/texture-holo-scan.webp) |

촘촘하게 반복되는 선 무늬입니다. ‘홀로 스캔 프리셋’은 색과 반사 설정까지 묶은 조합이고, 여기서는 무늬만 고릅니다.

### 포커스 펄스

| 원본 · 텍스쳐 없음 | 적용본 · 포커스 펄스 |
| --- | --- |
| [![텍스쳐 없는 카드 전체](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/family-standard.webp) | [![포커스 펄스 카드 전체](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/texture-focus-pulse.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/full/texture-focus-pulse.webp) |

카드 위쪽의 중심을 향해 모이고 퍼지는 선을 사용합니다. 흐름의 중심을 볼 수 있도록 이 항목은 카드 전체로 비교했습니다.


## 텍스쳐 조절

아래는 컨투어 텍스쳐를 사용한 같은 위치의 확대 비교입니다. 강도·밀도·각도는 역할이 다르므로 한 번에 하나씩 조절하면 결과를 이해하기 쉽습니다.

### 밀도

| 원본 · 50% | 적용본 · 200% |
| --- | --- |
| [![텍스쳐 밀도 50% 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/density-50.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/density-50.webp) | [![텍스쳐 밀도 200% 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/density-200.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/density-200.webp) |

밀도가 높을수록 같은 면적에 무늬가 촘촘히 들어갑니다. 선택 범위는 40~300%입니다. 밀도를 높이는 것은 반사 강도를 높이는 것과 다르며, 너무 작은 무늬는 축소된 카드에서 잘 보이지 않을 수 있습니다.

### 각도

| 원본 · 0도 | 적용본 · 45도 |
| --- | --- |
| [![텍스쳐 각도 0도 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/preset-classic.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/preset-classic.webp) | [![텍스쳐 각도 45도 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/angle-texture-45.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/angle-texture-45.webp) |

카드 표면에 있는 무늬의 방향을 돌립니다. 앞에서 비교한 반사 띠 각도는 빛 방향, 이 설정은 잔무늬 방향입니다.

### 강도

| 원본 · 0% | 적용본 · 100% |
| --- | --- |
| [![텍스쳐 강도 0% 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/strength-texture-0.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/strength-texture-0.webp) | [![텍스쳐 강도 100% 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/strength-texture-100.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/strength-texture-100.webp) |

무늬가 빛을 받았을 때 드러나는 정도를 변경합니다. 0%로 줄여도 무늬와 별개인 넓은 포일 반사는 남습니다.

### 명부 강도

| 원본 · 0% | 적용본 · 100% |
| --- | --- |
| [![명부 강도 0% 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/highlight-0.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/highlight-0.webp) | [![명부 강도 100% 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/highlight-100.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/highlight-100.webp) |

텍스쳐에서 빛을 받아 밝게 드러나는 부분의 세기를 조절합니다. 이번 비교는 카드 전체 설정으로 캐릭터·배경의 명부 반응을 함께 변경했습니다.

### 암부 강도

| 원본 · 0% | 적용본 · 100% |
| --- | --- |
| [![암부 강도 0% 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/shadow-0.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/shadow-0.webp) | [![암부 강도 100% 부분 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/shadow-100.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-crops/detail/shadow-100.webp) |

텍스쳐의 그늘과 어두운 결이 드러나는 정도를 조절합니다. 검은 머리카락과 짙은 옷처럼 원래 어두운 면을 비교하면 차이를 보기 쉽습니다. 무조건 크게 올리기보다 그림의 명암이 남는 정도를 찾는 편이 좋습니다.

## 대상별로 다른 텍스쳐 쓰기

`표면 텍스쳐`에서 카드 전체 외에 캐릭터·배경·프레임을 선택할 수 있습니다. 캐릭터와 배경은 분리된 이미지를 올렸을 때 각각의 영역을 다르게 꾸밀 수 있습니다. 한 장으로 합쳐진 그림은 파일 전체를 하나의 대상으로 다룹니다.

아래 예시는 카드 전체에 컨투어를 설정한 뒤 각 대상의 무늬를 하나씩 변경했습니다. 텍스쳐 강도는 70%, 밀도는 100%, 각도는 0도로 통일했습니다.

### 캐릭터만 변경하기

| 원본 · 캐릭터도 카드 설정 사용 | 적용본 · 캐릭터만 체브론 |
| --- | --- |
| [![캐릭터와 배경이 카드 컨투어 사용](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-review-2026-10-14/detail/target-inherit.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-review-2026-10-14/detail/target-inherit.webp) | [![캐릭터에만 체브론 적용](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-review-2026-10-14/detail/target-character-chevron.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-review-2026-10-14/detail/target-character-chevron.webp) |

배경에는 컨투어를 남기고 캐릭터에만 체브론을 적용했습니다. 캐릭터의 붉은 옷에서 굽이치는 선이 V자 무늬로 변경된 것을 볼 수 있습니다.

### 배경도 따로 변경하기

| 원본 · 배경은 카드 설정 사용 | 적용본 · 배경에 래디언트 격자 |
| --- | --- |
| [![캐릭터 체브론, 배경 컨투어](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-review-2026-10-14/background/target-character-chevron.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-review-2026-10-14/background/target-character-chevron.webp) | [![캐릭터 체브론 유지, 배경 래디언트 격자](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-review-2026-10-14/background/target-background-lattice.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-review-2026-10-14/background/target-background-lattice.webp) |

배경이 넓게 드러난 카드 왼쪽을 잘라 비교했습니다. 캐릭터의 체브론은 유지한 채 배경만 래디언트 격자로 변경했습니다. 개별 설정을 사용하는 동안에는 카드 전체 텍스쳐를 변경해도 해당 대상의 무늬는 그대로 남을 수 있습니다.

### 프레임에도 적용하기

| 원본 · 프레임도 카드 설정 사용 | 적용본 · 프레임에 홀로 스캔 |
| --- | --- |
| [![컨투어를 사용한 상단 프레임 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-review-2026-10-14/frame/target-frame-inherit.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-review-2026-10-14/frame/target-frame-inherit.webp) | [![홀로 스캔을 적용한 상단 프레임 확대](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-review-2026-10-14/frame/target-frame-holo-scan.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-review-2026-10-14/frame/target-frame-holo-scan.webp) |

프레임에 무늬를 적용하려면 `프레임 홀로그램 재질`을 켜야 합니다. 위 비교는 양쪽 모두 켠 상태에서 프레임의 컨투어를 홀로 스캔으로 변경했습니다. 제목 옆의 어두운 면에서 선 무늬의 차이를 확인할 수 있습니다.

텍스트의 홀로그램과 텍스쳐는 각 텍스트 항목에서 따로 설정합니다. 이 장의 제목과 하단 문구는 위치·색·글꼴을 유지하고 별도 홀로그램을 끈 상태입니다.

## 효과만 따로 확인하기

원본 그림이 화려해서 차이가 잘 안 보이면 `반사 패턴 보기`와 `표면 텍스쳐 보기`를 사용할 수 있습니다. 아래 이미지는 **실제 미리보기 영역의 화면 캡처**입니다. 일반 비교표와 촬영 방식이 다릅니다.

### 반사 패턴 보기

| 원본 · 카드에 합성 | 적용본 · 반사 패턴만 보기 |
| --- | --- |
| [![카드에 합성한 미리보기](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-options/view-composited.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-options/view-composited.webp) | [![반사 패턴만 표시한 미리보기](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-options/view-foil-only.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-options/view-foil-only.webp) |

카드 원본을 유지한 채 확인용 회색 바탕에서 반사 패턴의 흐름을 살펴봅니다.

### 표면 텍스쳐 보기

| 원본 · 카드에 합성 | 적용본 · 인쇄 텍스쳐만 보기 |
| --- | --- |
| [![카드에 합성한 미리보기](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-options/view-composited.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-options/view-composited.webp) | [![인쇄 텍스쳐만 표시한 미리보기](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-options/view-texture-only.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-foil/foil-package5-options/view-texture-only.webp) |

텍스쳐의 선과 빛 반응을 그림 없이 확인합니다. 확인용 화면에서 무늬가 보이는지 살펴본 뒤, 카드에 적용된 모습을 보며 강도를 조절하세요. 원본의 색에 무늬가 가려진 것인지 구분하기 쉽습니다. 두 보기 기능은 편집 중 확인에만 쓰며, PNG에는 원래 카드 구성이 저장됩니다.

## 차이가 잘 안 보일 때

텍스쳐가 작으면 밀도를 조금 낮추고, 반사 패턴이 약하면 강도를 올려 비교해 보세요. 캐릭터나 배경의 개별 텍스쳐가 선택되어 있다면 카드 전체 설정을 따르는지도 확인합니다. 마지막으로 카드를 천천히 움직여 보세요. 원본부터 밝거나 색이 강한 그림은 같은 설정도 다르게 보일 수 있습니다.

이 장의 예시는 화면에서 보이는 디지털 반사입니다. 실제 포일이나 인쇄 재료의 색과 촉감, 제작 결과는 인쇄소의 견본으로 확인하세요.


## 함께 볼 가이드

[기본 사용법](/notes/2026-09-23-ssr-card-maker-guide/) · [인쇄 재질](/notes/2026-09-23-ssr-card-maker-print-materials/) · [표면 마감](/notes/2026-09-23-ssr-card-maker-surface-finishes/) · [빛·환경·잉크](/notes/2026-09-23-ssr-card-maker-lighting-inks/) · [텍스트](/notes/2026-09-23-ssr-card-maker-text/)

---

> **AI disclosure**
>
> Final revision with OpenAI Codex using GPT-6 Astra (xhigh reasoning). Reviewed and edited by Yioo.
