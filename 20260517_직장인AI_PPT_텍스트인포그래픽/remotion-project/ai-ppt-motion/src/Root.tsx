import {Composition} from "remotion";
import {AiPptMotion} from "./Video";
import transcript from "./sentences.json";

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;
const lastSentenceEnd = transcript.sentences.at(-1)?.end ?? 0;
const durationInFrames = Math.ceil((lastSentenceEnd + 1.1) * FPS);

export const RemotionRoot = () => {
  return (
    <Composition
      id="AiPptMotion"
      component={AiPptMotion}
      durationInFrames={durationInFrames}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
