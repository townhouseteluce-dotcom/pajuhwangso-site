# 파주 황소바위마을 — 분양 홈페이지 시안

`index.html` 하나와 `assets/` 폴더만 있으면 그대로 동작합니다. 외부 폰트·CDN·스크립트 요청이 없어 인터넷 없이도 동일하게 보입니다.

## 폴더 구성

| 경로 | 내용 |
|---|---|
| `index.html` | 원페이지 시안 (히어로 → 왜 황소바위 → 평형·분양가 → 단지 스펙·필지 → 갤러리·영상 → 오시는 길·방문예약 → 푸터, 모바일 하단 고정 CTA) |
| `assets/style.css` | 디자인 (딥 포레스트 그린 + 웜 아이보리 + 샴페인 골드) |
| `assets/main.js` | 헤더 스크롤·모바일 메뉴·등장 애니메이션·방문예약 폼(문자 보내기) |
| `assets/hero-video.mp4` | 히어로 시네마틱 루프 영상 (실사 사진 3컷, 1440×810, 15.5초, 무음) |
| `assets/hero-video-poster.jpg` | 히어로 영상 포스터 (1280×720) |
| `assets/hero-sunset.jpg` / `hero-house.jpg` | 히어로·OG용 실사 (노을 진 골목 / 완공 주택) |
| `assets/aerial-village.jpg` | 항공 사진 (실사, 1600×1200) — **옆 현장 여부 확인 필요** |
| `assets/aerial-hero.jpg` | (삭제) 히어로 항공 크롭 — 옆 현장 사진으로 확인되어 제거 |
| `assets/office-entrance.jpg` | 분양사무실 입구·단지 진입로 (실사, 1600×739) |
| `assets/office-wayfinding.jpg` | 진입로 안내 간판 (실사, 1400×974) |
| `assets/design-example-a/b/c.jpg` | 주택 외관 이미지 — **실제 시공 사진이 아닌 AI 렌더링** |
| `assets/emblem.png`, `emblem-gold.png`, `favicon.png` | 엠블럼(원본·금색 단색·파비콘) |
| `assets/og-hwangso.jpg` | 카카오톡·SNS 공유 이미지 (1200×630) |

## 로컬에서 보기

```bash
cd hwangso-site
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000
```

`index.html`을 더블클릭해도 되지만, 카카오톡·문자 공유 미리보기(OG)는 서버에 올라가야 확인됩니다.

## 배포

1. **GitHub Pages** — 저장소에 이 폴더를 올리고 Settings → Pages → Branch: main / root
2. **Cloudflare Pages** — 폴더를 그대로 업로드 (빌드 명령 없음)
3. **일반 웹호스팅** — FTP로 `index.html`과 `assets/`를 루트에 업로드

배포 후 꼭 할 일:

- `index.html`의 `og:image`, `twitter:image`를 **절대 주소**로 변경
  (예: `https://도메인/assets/og-hwangso.jpg`)
- `og:url` 추가 (현재 없음), `link rel="canonical"` 추가
- 실제 도메인으로 접속해 카카오톡 공유 미리보기 확인

## 수정 포인트

| 항목 | 위치 | 현재 값 |
|---|---|---|
| 상담 전화 | `index.html` — `tel:+821048257879`, `sms:+821048257879`, 표시 텍스트 `010-4825-7879` (헤더·히어로·오시는 길·푸터·하단바 5곳), `assets/main.js` — `PHONE` 상수 | 010-4825-7879 |
| 가격 | `index.html` — `.hero-prices`, `.price-grid`, `#fType` 옵션 | 24평 3억대~ / 36평 4억 9,000만 / 54평 철콘 6억 9,000만 |
| 세대수 | 히어로 문단, `.strip`, `.spec-grid`, 푸터 | 110세대 · 70세대 이상 입주 |
| 주소 | 히어로·오시는 길·푸터·지도 링크 | 경기도 파주시 월롱면 황소바위길 406-1 |
| 색상 | `assets/style.css` 상단 `:root` 변수 | `--forest #10251b`, `--gold #b8914f`, `--ivory #f8f4ea` |

## 표기 원칙 (분양 광고 주의)

- `assets/design-example-*.jpg`는 **AI로 만든 이미지**입니다. 화면에서 `설계 예시` 배지와 캡션으로 표시하고, 푸터에도 "실제 시공 사진이 아닌 이미지"라고 적어 두었습니다. 이 표기를 지우지 마세요.
- 항공 사진은 분양 자료에 그려진 주석(단지 표시·영도초·도내IC 등)이 포함된 원본입니다. 캡션에 "분양 자료"로 명시했습니다.
- **2026-11-19**: 히어로 첫 장면의 드론 항공 사진(`hero-aerial.jpg`, 여름)은 **옆 현장(다른 단지)** 사진으로 건축주 확인을 받아 영상·포스터·OG·HTML에서 모두 제거했습니다. 히어로 영상은 노을 골목 → 완공 주택 → 분양사무실 입구 3컷으로 다시 렌더링했고, OG 카드도 `hero-house.jpg` 기반으로 재생성했습니다. 항공 사진을 다시 넣기 전에는 반드시 본인 단지 사진인지 확인하세요.
- 가격·잔여 세대는 상담 시점 기준이라는 문구를 유지하세요.
- `notes/hwangso-photos/09-분양사무실-정면-표시-실사.jpg`는 사진 위에 빨간 펜 동그라미가 그려져 있어 사용하지 않았습니다. 대신 같은 날 찍은 `08` 사진을 두 가지로 잘라 진입로 안내(오시는 길)와 갤러리에 썼습니다.
