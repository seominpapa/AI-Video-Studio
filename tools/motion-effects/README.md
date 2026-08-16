# Anime.js와 Motion 효과 사용 가이드

Remotion과 HyperFrames 모션그래픽에서 사용할 수 있는 선택 효과 라이브러리입니다. 공식 문서는 [Anime.js](https://animejs.com/documentation/)와 [Motion](https://motion.dev/docs)에서 확인합니다.

## 설치 위치

루트에는 설치하지 않습니다. 실제 작업별 `package.json`이 있는 폴더에서만 설치합니다.

```powershell
# Remotion: <작업폴더>/remotion-project/remotion-video/
# HyperFrames: <작업폴더>/source-hyperframes/
npm.cmd install animejs motion
```

## 선택 기준

| 필요 효과 | 권장 라이브러리 |
|---|---|
| SVG path draw, 순차 등장, 복합 타임라인, easing | Anime.js |
| React 컴포넌트 spring·layout 전환 | Motion React (`motion/react`) |
| HTML/CSS 요소의 JavaScript spring·stagger | Motion JavaScript (`motion`) |
| 기존 HyperFrames GSAP 타임라인으로 충분 | 기존 GSAP 유지 |

Anime.js는 `import { animate } from 'animejs'`로, Motion React는 `import { motion } from 'motion/react'`로, Motion JavaScript는 `import { animate, spring, stagger } from 'motion'`로 가져옵니다. 두 라이브러리 모두 `animate`를 내보내므로 같은 모듈에서 사용할 때는 별칭을 명시합니다.

## 안전 규칙

- 같은 요소의 같은 속성(`transform`, `opacity`, SVG path 등)은 Anime.js, Motion, GSAP, CSS 중 정확히 하나만 제어합니다.
- Remotion은 `useCurrentFrame()`과 FPS를 기준으로 장면 시간을 계산합니다. timer, scroll, hover, drag, 실제 시계 시간에만 의존하는 애니메이션은 최종 MP4의 필수 타이밍으로 쓰지 않습니다.
- Motion의 hover·drag·scroll 효과는 Studio 또는 웹 미리보기에서만 사용하고 최종 composition에는 포함하지 않습니다.
- 효과를 추가한 장면은 시작·중간·끝 still frame을 만들고, 타임라인·오디오 싱크·텍스트 겹침을 확인합니다.
