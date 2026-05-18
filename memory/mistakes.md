# Mistakes To Avoid

반복 실수를 막기 위한 메모입니다.

## 영상 제작

- 스크립트만 보고 최종 영상을 만들지 않습니다. 음성 파일이나 스크립트 파일이 없으면 먼저 요청합니다.
- 텍스트와 인포그래픽이 겹친 상태로 렌더를 완료하지 않습니다.
- 대표 프레임 리뷰 없이 최종 완료를 선언하지 않습니다.
- 타임스탬프와 오디오 내용이 어긋난 상태로 장면을 확정하지 않습니다.
- 루트 폴더에 소스, 임시 프레임, 렌더 파일을 흩뿌리지 않습니다.

## 문서 관리

- 도구별 소스 폴더에 공통 문서를 넣지 않습니다. 공통 규칙은 루트에 둡니다.
- 사용자 홈이나 다른 프로젝트의 절대 경로를 공통 문서에 고정하지 않습니다.
## 2026-05-17 - Remotion text/infographic overlap

- Scene-specific floating text labels can collide with icons, connector lines, or lane graphics after animation timing or scale changes. Prefer reserved text zones: a compact upper narrative card plus a bottom label tray.
- Partially faded old scene elements can remain visible under the label tray. Fade completed/old elements fully or keep them outside the reserved text areas.
- After any layout fix, render representative start/mid/end frames again and inspect the actual PNGs, not only the React coordinates.

## 2026-05-17 - Remotion public audio placement

- Do not set Remotion `publicDir` to the whole task folder just to read root `voiceover.wav`; it causes outputs and review frames to be copied as public assets. Keep `voiceover.wav` at the task root as the source of truth and use a small `public/voiceover.wav` render link/copy when Remotion needs `staticFile()`.

## 2026-05-17 - Timestamp sync drift

- Do not condense a source/audio timeline into fewer Remotion scenes unless the audio script was intentionally rewritten. The AI PPT project drifted because the source timeline had 12 scenes but Remotion had 10 scenes.
- For sync fixes, compare source timeline starts against Remotion `scenes` and text overlays, then render 1-second samples plus scene-boundary frames before final render.
- Do not declare sync fixed only because scene starts sit near silent intervals. Silence detection finds pause candidates, not semantic sentence boundaries. Use a timecoded transcript or forced alignment for exact narration-to-visual sync.
- If multiple old timelines remain in one task and narration-to-visual sync is still wrong after correction attempts, stop patching the old implementation. Preserve only the task-root `voiceover.wav`, clear generated tool sources/outputs/review frames, and rebuild from a timecoded transcript.
