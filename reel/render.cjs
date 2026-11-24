// Renders reel/index.html to MP4, one screenshot per frame, piped straight into ffmpeg.
//
//   node reel/render.cjs            both shapes
//   node reel/render.cjs wide       1920x1080 only
//   node reel/render.cjs tall       1080x1920 only
//   node reel/render.cjs wide 7.5   one PNG of the frame at 7.5 seconds (for checking)
//
// Run node reel/music.cjs first to make the backing track (reel/music.wav).
// Needs ffmpeg, Google Chrome and the puppeteer-core package (npm i puppeteer-core).
const { spawn } = require("node:child_process");
const { once } = require("node:events");
const path = require("node:path");
const fs = require("node:fs");
const puppeteer = require("puppeteer-core");

const SECONDS = 18;
const FPS = 30;
const SHAPES = {
  wide: { width: 1920, height: 1080 },
  tall: { width: 1080, height: 1920 },
};
const CHROME =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const outDir = path.join(__dirname, "out");
const pageUrl = "file://" + path.join(__dirname, "index.html");

async function main() {
  const [only, still] = process.argv.slice(2);
  const names = only ? [only] : Object.keys(SHAPES);
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  try {
    for (const name of names) {
      const size = SHAPES[name];
      if (!size) throw new Error(`Unknown shape "${name}". Use wide or tall.`);
      const page = await browser.newPage();
      await page.setViewport({ ...size, deviceScaleFactor: 1 });
      await page.goto(pageUrl, { waitUntil: "load" });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map((img) => img.decode()));
      });

      if (still !== undefined) {
        const file = path.join(outDir, `${name}-${still}s.png`);
        await page.evaluate((t) => window.seek(t), Number(still));
        await page.screenshot({ path: file });
        console.log(file);
      } else {
        await record(page, name);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

async function record(page, name) {
  const file = path.join(outDir, `AbrarShowreel-${name}.mp4`);
  // The backing track from music.cjs goes in when it is there; without it the video is silent.
  const music = path.join(__dirname, "music.wav");
  const sound = fs.existsSync(music)
    ? ["-i", music, "-map", "0:v", "-map", "1:a", "-c:a", "aac", "-b:a", "192k", "-shortest"]
    : [];
  const ffmpeg = spawn(
    "ffmpeg",
    [
      "-y", "-loglevel", "error",
      "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
      ...sound,
      "-c:v", "libx264", "-preset", "slow", "-crf", "16",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      file,
    ],
    { stdio: ["pipe", "inherit", "inherit"] },
  );

  const frames = SECONDS * FPS;
  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.seek(t), i / FPS);
    const png = await page.screenshot({ type: "png" });
    if (!ffmpeg.stdin.write(png)) await once(ffmpeg.stdin, "drain");
  }
  ffmpeg.stdin.end();
  const [code] = await once(ffmpeg, "close");
  if (code !== 0) throw new Error(`ffmpeg exited with code ${code}`);
  console.log(file);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
