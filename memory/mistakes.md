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

## 2026-05-26 - Remotion Tailwind config in non-Tailwind projects

- `create-video --no-tailwind` can still leave Tailwind-related dependencies or config in a generated Remotion project. If `remotion still` fails while scanning parent directories, remove unused Tailwind config hooks from `remotion.config.ts` before rendering.
- Do not import task-root files such as `timeline/scenes.json` directly from Remotion `src/` if the bundler starts scanning parent directories and hits sandbox access errors. Keep `timeline/scenes.json` as the source of truth, copy it to a render-local generated file such as `src/scenes.generated.json`, and verify the two files match before rendering.

## 2026-05-30 - Korean line breaks and floating callouts

- Do not place floating callout cards over tables, database rows, node maps, or funnel labels. Put callouts in their own reserved side area and verify the full scene, not only the center frame.
- Korean short endings such as `다면`, `으로`, `접/속` can be split awkwardly by automatic wrapping inside compact cards. Use manual line arrays or separate text rows for card copy, not browser auto-wrap.
- After a user reports overlap or wrapping issues, extract 1-second samples from the final MP4 for the affected time range and inspect a contact sheet before re-delivering.

## 2026-06-07 - Bottom subtitle safe area

- Do not use the bottom 18-22% of the frame for core infographics, labels, decorative strokes, or progress bars when the video needs subtitles.
- Keep labels inside the infographic, below the upper explanation, or in a side tray above the subtitle-safe area.
- Review representative frames with the subtitle-safe area in mind; a visually clean infographic still fails if it leaves no room for the final caption.

## 2026-06-07 - Korean numeric labels in motion graphics

- Narration scripts can spell numbers in Korean for pronunciation, but on-screen labels and titles should prefer compact Arabic numerals for units and steps, such as `5단계`, `3개월`, `30분`, and `60%`.
- When changing display numerals, update both the canonical `timeline/scenes.json` and the Remotion source data, then render representative frames from the final MP4.

## 2026-06-07 - Step scene timing

- Do not start a numbered step scene during the preamble that introduces the overall method. Start it at the actual `첫 번째/두 번째/... 스텝` narration, or 0.1-0.2 seconds before that phrase.
- After changing scene boundaries, verify the previous scene still covers the preamble and render boundary frames before and after the new start time.
- For step scenes with internal item highlights, do not divide the scene duration evenly. Use transcript timestamps for each highlighted item, such as email, meeting notes, report, summary, and Excel.

## 2026-06-13 - Voice loudness spikes after loudnorm

- Integrated `loudnorm` can still leave short TTS/Voicebox sections noticeably louder than surrounding narration. Do not treat `-16 LUFS` alone as audio QA.
- After creating `voice_normalized.wav`, scan 1-second RMS/peak windows and compare suspicious timestamps with nearby seconds.
- If a user reports local volume spikes, preserve `voice_normalized.wav`, create a separate balanced file such as `voice_balanced.wav` with faded gain envelopes, replace the render audio copy, and re-render from source.
- Record before/after RMS around the reported timestamps in the QA summary.

## 2026-07-03 - npm prefix in empty task folders

- Before running `npm install` in a newly created non-project task folder, create a minimal `package.json` or use an explicit project directory. Otherwise npm can resolve the prefix to the user home folder and install packages outside the task workspace.

## 2026-07-04 - Final MP4 sample extraction

- When extracting final MP4 QA samples from `timeline/scenes.json`, read the actual timeline schema before scripting. Current video timelines use `start` and `end`; using assumed fields such as `startSec` and `endSec` can silently extract every sample at 0 seconds.
- After sample extraction, inspect `review-frames/final-samples/sample-times.txt` before trusting the contact sheet. If all timestamps are 0 or duplicated, regenerate the samples before final delivery.

## 2026-07-05 - Remotion render paths with Korean task folders

- If Remotion or esbuild fails under a Korean task-folder path with access or mojibake path errors, rerun the Remotion command with the Windows short path and sandbox escalation.
- Do not invent a short alias such as `OUTPUT~1` for a directory that has not been confirmed with `cmd /c "for %I in (...) do @echo %~sI"`; Windows may create a literal `OUTPUT~1` folder. Render to a verified existing short path or move the output back into `outputs/` immediately and remove the temporary folder.
- For scene-start review frames, use `ceil(scene.start * fps)` instead of `floor(scene.start * fps)` so the sampled frame is not just before the scene boundary.

## 2026-07-05 - Mintlify lesson map density

- Do not show all scene titles in the left `LESSON MAP` for long Korean lecture videos. It becomes too dense and makes every scene feel like the same docs layout.
- Prefer a compact current-scene card plus 3-4 broad lesson phases, with only a small progress indicator.
- Keep the right rail short as well, usually 3 key points or fewer, so the central infographic remains the main visual.

## 2026-08-15 - Connector-layer ordering

- Connector strokes must be rendered on a lower z-index than every node, card, pill, and text container. DOM order alone is not a safe layering rule for positioned Remotion elements.
- When a connector is only decorative, route it through unused whitespace rather than a card interior. Re-render the affected full frame after any z-index or coordinate change.
- Do not construct reusable arrowheads from rotated CSS borders. Use one SVG arrow primitive with a fixed tip, centerline, and rotation origin, then anchor its start and end to the actual card boundaries.

## 2026-08-16 - White Animation PyAV concat and pen alpha

- The upstream White Animation PyAV concat fallback can fail with non-monotonic timestamps when each source clip restarts PTS at zero. Keep the upstream repository unchanged and use a task-local merger that assigns continuous frame PTS and a fixed output time base.
- An image edit that visually shows a checkerboard may still be an opaque checkerboard image. Before using an edited drawing-hand asset, verify the PNG has a real alpha channel and that a transparent corner pixel has alpha zero.

## 2026-08-16 - Remotion FFmpeg shared runtime dependencies

- Do not copy only `ffmpeg.exe` or `ffprobe.exe` out of `@remotion/compositor-win32-x64-msvc`. They are shared builds and can require adjacent files such as `avdevice-61.dll`, `avcodec-61.dll`, and runtime support DLLs.
- Keep the complete runtime directory together and validate both executables with `-version` before use. On Windows, suppress critical-error dialogs during this readiness check so a missing DLL becomes a clear nonzero exit instead of a blocking popup.
- Prefer a runnable system `ffmpeg`/`ffprobe` pair. If PATH has no valid pair, use a task-local complete runtime directory; never treat executable presence alone as readiness.

## 2026-08-16 - Render-safe card boundaries

- Do not rely on a 1px pale or near-black hairline as the only boundary of a card, node, chip, or diagram container in a compressed video. It can disappear or look muddy after H.264 encoding and downscaling.
- Keep 1px hairlines for background dividers only. Use a distinct, render-safe border token at 2px for ordinary bounded components, and a 3px accent outline only for the active state.
- When a user reports weak outlines, update the design brief and every supported implementation token set together (for example, Remotion theme and HyperFrames CSS) before the next render.
