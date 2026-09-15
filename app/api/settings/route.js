import dbConnect from "../../../lib/db";
import Settings from "../../../models/Settings";
import cloudinary from "../../../lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const userId = session.user.email;
  try {
    await dbConnect();
    const settings = await Settings.findOne({ userId });
    return new Response(JSON.stringify(settings || {}), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const userId = session.user.email;
  try {
    const data = await req.json();
    await dbConnect();

    // Check if companyLogo is a base64 string
    if (data.companyLogo && data.companyLogo.startsWith("data:image")) {
      const result = await cloudinary.uploader.upload(data.companyLogo, { folder: "tax_settings" });
      data.companyLogo = result.secure_url;
    }

    const settings = await Settings.findOneAndUpdate(
      { userId },
      { ...data, userId },
      { new: true, upsert: true }
    );

    return new Response(JSON.stringify(settings), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
