import { join } from "path";
import { spawn } from "child_process";

// Resize PNG using ImageMagick
async function resizePng(sourcePath: string, targetPath: string, size: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const convert = spawn("convert", [
      "-background", "none",
      "-resize", `${size}x${size}`,
      sourcePath,
      targetPath
    ]);

    convert.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ImageMagick convert failed with code ${code}`));
      }
    });

    convert.on("error", (error) => {
      reject(error);
    });
  });
}

async function generateIcon(size: number, filename: string, templatePath: string) {
  const rootDir = process.cwd();
  const publicDir = join(rootDir, "public");
  const pngPath = join(publicDir, filename);

  // Resize template PNG to target size
  await resizePng(templatePath, pngPath, size);

  console.log(`Generated ${filename} (${size}x${size})`);
}

async function generateAllIcons() {
  console.log("Generating iOS home screen icons with ImageMagick...");

  const rootDir = process.cwd();
  const templatePath = join(rootDir, "Gemini_Generated_Image_wlwm2ywlwm2ywlwm.png");

  try {
    // Generate all required icon sizes from template
    await generateIcon(180, "apple-touch-icon-180x180.png", templatePath);
    await generateIcon(152, "apple-touch-icon-152x152.png", templatePath);
    await generateIcon(120, "apple-touch-icon-120x120.png", templatePath);
    await generateIcon(180, "apple-touch-icon.png", templatePath); // Default fallback
    await generateIcon(192, "icon-192x192.png", templatePath);
    await generateIcon(512, "icon-512x512.png", templatePath);

    console.log("All icons generated successfully as PNG files!");
  } catch (error) {
    console.error("Error generating icons:", error);
    process.exit(1);
  }
}

generateAllIcons();

