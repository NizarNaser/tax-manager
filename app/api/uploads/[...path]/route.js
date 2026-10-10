import fs from "fs/promises";
import path from "path";
import { UPLOAD_ROOT } from "../../../../lib/localUpload";

const CONTENT_TYPE_BY_EXT = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(req, { params }) {
  const { path: segments } = await params;
  const resolved = path.resolve(UPLOAD_ROOT, ...segments);

  if (!resolved.startsWith(UPLOAD_ROOT + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const data = await fs.readFile(resolved);
    const ext = path.extname(resolved).toLowerCase();
    return new Response(data, {
      headers: {
        "Content-Type": CONTENT_TYPE_BY_EXT[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
