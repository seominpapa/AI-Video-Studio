import {execFileSync} from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const plan = JSON.parse(fs.readFileSync(path.join(root, "src", "scene-plan.json"), "utf8"));
const outDir = path.resolve(root, "..", "..", "review-frames", "final-check");
fs.mkdirSync(outDir, {recursive: true});

const remotionBin = process.execPath;
const remotionCli = path.join(root, "node_modules", "@remotion", "cli", "remotion-cli.js");
const fps = 30;

for (const scene of plan.scenes) {
  const moments = [
    ["start", scene.start],
    ["mid", (scene.start + scene.end) / 2],
    ["end", Math.max(scene.start, scene.end - 0.12)],
  ];

  for (const [label, seconds] of moments) {
    const frame = Math.max(0, Math.round(seconds * fps));
    const target = path.join(outDir, `${scene.id}-${label}-f${String(frame).padStart(4, "0")}.png`);
    execFileSync(
      remotionBin,
      [
        remotionCli,
        "still",
        "src/index.ts",
        "AiPptMotion",
        target,
        "--frame",
        String(frame),
        "--scale",
        "0.35",
        "--overwrite",
      ],
      {cwd: root, stdio: "inherit"},
    );
  }
}

console.log(`review frames written to ${outDir}`);
