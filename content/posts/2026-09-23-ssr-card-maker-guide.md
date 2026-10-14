---
title: "SSR 카드 메이커 사용법: 이미지 한 장으로 홀로그램 카드 만들기"
slug: "2026-09-23-ssr-card-maker-guide"
date: "2026-09-23"
updated: "2026-10-14"
status: published
category: implementation
tags:
  - ssr-card-maker
  - guide
  - image-editing
summary: "이미지 업로드부터 프리셋·문구 편집, PNG·GIF·WebP 내보내기와 ZIP 저장·복원까지 첫 카드를 만드는 순서로 안내합니다."
canonical: "/notes/2026-09-23-ssr-card-maker-guide/"
---

좋아하는 그림에 프레임과 문구를 넣고, 기울일 때 반짝이는 카드를 만들어 보세요. SSR 카드 메이커에서는 이미지 한 장으로 시작해 포일과 표면 무늬를 더할 수 있습니다.

[SSR 카드 메이커 열기](https://yioo.link/tools/ko/image/ssr-card-maker/)

[![여러 재질과 사용자 프레임을 조합한 홀로그램 카드 완성 예시](/notes/assets/posts/2026-09-23-ssr-card-maker-guide/print-material-package5-options-cropped/source-card.webp)](/notes/assets/posts/2026-09-23-ssr-card-maker-guide/print-material-package5-options-cropped/source-card.webp)

여러 재질을 조합한 완성 카드 예시입니다. 별도로 준비한 프레임과 텍스쳐가 포함되어 있습니다. 아래에서는 자신의 이미지와 기본 프리셋으로 카드 한 장을 만든 뒤, 이미지와 편집 파일을 각각 저장해 봅니다.

## 1. 이미지 올리기

> [!guide-step]
>
> [![캐릭터 이미지를 올릴 때 선택하는 캐릭터 메뉴](/notes/assets/posts/2026-09-23-ssr-card-maker-guide/walkthrough/01-character.png "focus=2.8571,27.084,88.5714,14.0541")](/notes/assets/posts/2026-09-23-ssr-card-maker-guide/walkthrough/01-character.png)
>
> `카드 구성 → 캐릭터`에서 이미지를 올립니다. 캐릭터와 배경이 함께 있는 그림도 그대로 사용할 수 있습니다. 풍경이나 사진처럼 인물이 없는 이미지로 시작해도 됩니다.
>
> 업로드한 다음에는 이미지의 위치와 크기를 조절합니다. 얼굴이나 그림의 중요한 부분이 카드 바깥으로 잘리지 않는지 먼저 확인해 주세요.

배경과 캐릭터에 서로 다른 효과를 주고 싶다면 `배경`에도 파일을 올리고, 캐릭터는 인물 바깥이 투명한 이미지로 미리 분리해 준비합니다. 배경이 남아 있는 사각형 이미지를 캐릭터 칸에 올리면 그 사각형 전체가 캐릭터 영역이 됩니다.

처음에는 한 장으로 완성해 보고, 부분별로 다르게 꾸미고 싶을 때 분리된 파일을 준비해도 좋습니다.

## 2. 카드 프리셋 고르기

> [!guide-step]
>
> [![편집 대상에서 선택하는 카드 프리셋 메뉴](/notes/assets/posts/2026-09-23-ssr-card-maker-guide/walkthrough/02-card-preset.png "focus=3.0875,60.3525,88.2794,16.4473")](/notes/assets/posts/2026-09-23-ssr-card-maker-guide/walkthrough/02-card-preset.png)
>
> `카드 프리셋`에서 원하는 구성을 고릅니다. 프리셋은 프레임, 텍스트 배치, 재질 설정 등을 함께 변경합니다. 문구와 효과를 세밀하게 고치기 전에 먼저 골라 두세요.
>
> 선택한 모습에서 더 변경하고 싶은 부분이 있으면 `카드 구성`에서 프레임을 변경하거나, 별도의 `텍스트 항목`에서 문구를 수정합니다. 빛이나 무늬는 `카드 상세`에서 조절할 수 있습니다. 처음에는 눈에 띄는 한두 가지만 변경해 비교해 보세요.

## 3. 제목과 문구 변경하기

> [!guide-step]
>
> [![나의 첫 카드 문구가 선택된 텍스트 항목 목록](/notes/assets/posts/2026-09-23-ssr-card-maker-guide/walkthrough/03-text-items.png "focus=3.0875,17.8012,88.2794,24.6316")](/notes/assets/posts/2026-09-23-ssr-card-maker-guide/walkthrough/03-text-items.png)
>
> 1. `편집` 화면에서 `텍스트 항목`을 찾습니다.
> 2. `텍스트 항목`에서 변경할 문구를 선택합니다.
> 3. `기본 설정`에서 내용을 입력하고 글꼴, 글자 색, 크기와 위치를 맞춥니다.
> 4. 카드 전체를 보며 제목이 그림이나 프레임과 겹치지 않는지 확인합니다.

한글 제목이라면 `나의 첫 카드`처럼 짧은 문구와 Noto Sans KR로 시작해 보세요. 제목과 하단 설명은 각각 선택해 편집합니다. 새 문구는 `텍스트 추가`로 만듭니다.

프레임의 제목·설명 칸에 연결된 항목은 `프레임에 맞춤`을 사용할 수 있습니다. 직접 추가한 문구를 원하는 위치와 크기로 배치하려면 직접 조절해야 합니다. 문구를 잠시 빼고 보고 싶다면 `이 텍스트 숨기기`를 사용하세요. 마지막 한 항목은 삭제할 수 없으므로, 문구를 모두 빼려면 남은 항목도 숨겨야 합니다.

## 4. 움직이며 반사 확인하기

> [!guide-step]
>
> [![보기 도구의 정면 빛 스윕 선택 위치](/notes/assets/posts/2026-09-23-ssr-card-maker-guide/walkthrough/04-preview-tools.png "focus=3.4216,54.8934,92.4048,15.7914")](/notes/assets/posts/2026-09-23-ssr-card-maker-guide/walkthrough/04-preview-tools.png)
>
> 카드 위에서 마우스를 움직이면 기울기와 빛의 반응이 달라집니다. 휴대폰에서는 카드에 손가락을 댄 채 움직여 확인할 수 있습니다. `보기 도구`의 `정면 빛 스윕`으로 카드를 정면에 두고 빛이 지나가는 모습도 볼 수 있습니다.

같은 설정도 그림에 따라 다르게 보입니다. 흰색이나 밝은 노란색이 넓게 있는 그림에서는 반짝임이 덜 눈에 띌 수 있습니다. 효과를 비교할 때는 비슷한 각도에서 보고, 한 번에 한 가지 설정만 변경해 보세요.

## 5. PNG로 카드 한 장 저장하기

> [!guide-step]
>
> [![PNG 내보내기 설정과 PNG 다운로드 버튼](/notes/assets/posts/2026-09-23-ssr-card-maker-guide/walkthrough/05-png.png "focus=1.9324,78.8821,95.9947,13.8726")](/notes/assets/posts/2026-09-23-ssr-card-maker-guide/walkthrough/05-png.png)
>
> 1. 작업 영역 상단의 `내보내기`를 누릅니다.
> 2. 형식에서 `PNG`를 선택합니다.
> 3. 처음에는 `권장 각도`와 기본 `출력 크기`로 결과를 확인합니다.
> 4. `PNG 다운로드`를 누르고, 다운로드한 이미지를 열어 문구와 반사가 잘 보이는지 확인합니다.

PNG는 투명 배경의 정지 이미지입니다. 기본 출력은 880 × 1160px입니다. 카드 각도를 직접 정하려면 `직접 조절`에서 가로·세로 기울기를 변경합니다.

정면에서 특정 위치에 빛이 닿은 장면을 저장하고 싶다면 `정면`을 선택하고 `정면 빛 스윕`을 켭니다. `진행 위치`를 움직여 원하는 빛의 위치를 고른 뒤 다운로드합니다.

다운로드 버튼을 누를 수 없다면 캐릭터 칸에 이미지를 올렸는지 확인하세요. 다른 파일을 생성 중일 때도 잠시 비활성화됩니다.

## 6. 움직이는 GIF·WebP 저장하기

> [!guide-step]
>
> [![GIF 내보내기에서 카드 회전과 정면 빛 스윕을 고르는 애니메이션 연출](/notes/assets/posts/2026-09-23-ssr-card-maker-guide/walkthrough/06-animation.png "focus=1.9324,27.0002,95.9947,14.7646")](/notes/assets/posts/2026-09-23-ssr-card-maker-guide/walkthrough/06-animation.png)
>
> `내보내기`에서 `GIF` 또는 `WebP`를 고르고 `애니메이션 연출`을 선택합니다.
>
> `출력 크기`를 확인한 뒤 `GIF 다운로드` 또는 `WebP 다운로드`를 누릅니다. 두 형식의 기본 크기는 440 × 580px이며, 중성색 배경의 반복 애니메이션으로 저장됩니다. GIF는 표현할 수 있는 색이 제한되고 WebP는 전체 색상을 사용합니다. 게시할 서비스가 해당 형식의 애니메이션을 지원하는지도 확인해 주세요.

| 연출 | 움직임과 조절할 항목 |
| --- | --- |
| 카드 회전 | 카드가 좌우로 기울어집니다. `고정 세로 기울기`로 위아래 각도를 맞춥니다. |
| 정면 빛 스윕 | 카드 방향을 정면에 두고 빛이 지나갑니다. `총 재생시간`을 1~5초로 정합니다. |

생성이 오래 걸리면 먼저 기본 크기로 저장해 보세요. GIF·WebP 생성 중에는 취소 버튼을 사용할 수 있습니다.

## 7. 다시 편집할 ZIP 남기기

나중에 이미지, 문구나 재질을 변경하려면 **결과 이미지와 별도로 ZIP을 저장**해 두세요. PNG·GIF·WebP 파일만으로는 편집 상태를 복원할 수 없습니다. 페이지를 새로고침하거나 닫기 전에 ZIP을 남기는 것이 좋습니다.

> [!guide-step]
>
> [![인쇄용 자료 포함을 끈 기본 ZIP 저장 화면](/notes/assets/posts/2026-09-23-ssr-card-maker-guide/walkthrough/07-zip.png "focus=1.9324,70.619,95.9947,18.8571")](/notes/assets/posts/2026-09-23-ssr-card-maker-guide/walkthrough/07-zip.png)
>
> 1. 상단의 `ZIP 저장`을 누릅니다. `내보내기 → ZIP` 화면이 열립니다.
> 2. 편집을 이어갈 목적이라면 기본 상태에서 화면 안의 `ZIP 저장`을 누릅니다.
> 3. 다운로드된 `ssr-card-project.zip`을 보관합니다.
> 4. 다시 열 때는 상단 `ZIP 불러오기`를 누르고 저장한 파일을 선택합니다.

불러오기 전에 지금 편집 중인 카드도 ZIP으로 저장해 두세요. ZIP에는 이미지와 문구, 프레임, 사용자 텍스쳐와 편집 설정이 들어갑니다. 현재 빛 스윕 설정은 저장되지 않으므로, 복원 뒤 내보낼 때 다시 설정해야 합니다.

ZIP에는 숨긴 항목과 원본 이미지의 메타데이터도 포함될 수 있습니다. 다른 사람에게 공유하기 전에는 안에 든 파일을 확인하세요.

인쇄용 레이어나 분판 자료가 필요할 때는 `인쇄용 자료 포함`을 선택합니다. 실제 인쇄에 쓰려면 업체의 규격, 색상 변환과 제작 가능 여부를 별도로 확인해야 합니다. 이 도구는 홀로그램과 재질의 모습을 화면에서 표현합니다.

## 더 변경하고 싶은 부분 찾아보기

첫 카드를 저장했다면 필요한 기능부터 하나씩 살펴보세요.

| 변경하고 싶은 부분 | 가이드 |
| --- | --- |
| 용지 바탕, 백색 인쇄, 캐릭터 모양의 요철 | [인쇄 재질](/notes/2026-09-23-ssr-card-maker-print-materials/) |
| 빛의 흐름, 무지개 반사, 표면의 작은 결 | [포일](/notes/2026-09-23-ssr-card-maker-foil/) |
| 금속성 재료, 유광·무광 필름, UV 코팅 | [표면 마감](/notes/2026-09-23-ssr-card-maker-surface-finishes/) |
| 주광·자외선·암실과 특수 잉크 | [빛·환경·잉크](/notes/2026-09-23-ssr-card-maker-lighting-inks/) |
| 문구의 글꼴·위치·포일 색과 요철 | [텍스트](/notes/2026-09-23-ssr-card-maker-text/) |

---

> **AI disclosure**
>
> Final revision with OpenAI Codex using GPT-6 Astra (xhigh reasoning). Reviewed and edited by Yioo.
