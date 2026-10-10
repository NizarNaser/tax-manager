import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

// UPLOADS_DIR must be an absolute path outside the project's build output in
// production: Next's standalone server does process.chdir(__dirname) into
// .next/standalone on boot, and `next build` recreates .next from scratch on
// every deploy, which would silently wipe uploads stored under process.cwd().
export const UPLOAD_ROOT = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(process.cwd(), "uploads");

const EXT_BY_MIME = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function saveBase64Image(dataUrl, subfolder) {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("Invalid image data");

  const [, mimeType, base64Data] = match;
  const ext = EXT_BY_MIME[mimeType] || "bin";
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const dir = path.join(UPLOAD_ROOT, subfolder);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, fileName), Buffer.from(base64Data, "base64"));

  return `/api/uploads/${subfolder}/${fileName}`;
}
