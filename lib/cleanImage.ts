import "server-only";

import sharp from "sharp";

export async function cleanImage(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .rotate()
    .toBuffer();
}
