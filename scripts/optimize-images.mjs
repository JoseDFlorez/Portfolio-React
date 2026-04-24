import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectImages = [
  { slug: "campuslove", widths: [320, 640, 960, 1024] },
  { slug: "formula1-webcomponents", widths: [320, 640, 960, 1200] },
  { slug: "sgci-app", widths: [320, 640, 960, 1024] },
  { slug: "todo-list-flask", widths: [320, 640, 960, 1280] },
];

const root = process.cwd();
const sourceDir = path.join(root, "public", "img", "projects");
const outputDir = path.join(sourceDir, "optimized");

await mkdir(outputDir, { recursive: true });

for (const image of projectImages) {
  const source = path.join(sourceDir, `${image.slug}.png`);

  for (const width of image.widths) {
    const resized = sharp(source).resize({ width, withoutEnlargement: true });

    await Promise.all([
      resized
        .clone()
        .avif({ quality: 50, effort: 6 })
        .toFile(path.join(outputDir, `${image.slug}-${width}.avif`)),
      resized
        .clone()
        .webp({ quality: 76, effort: 6 })
        .toFile(path.join(outputDir, `${image.slug}-${width}.webp`)),
    ]);
  }
}
