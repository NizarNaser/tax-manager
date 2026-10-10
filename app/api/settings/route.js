import dbConnect from "../../../lib/db";
import Settings from "../../../models/Settings";
import { saveBase64Image } from "../../../lib/localUpload";
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
    const settings = await Settings.findOne({ where: { userId } });
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
      data.companyLogo = await saveBase64Image(data.companyLogo, "logos");
    }

    let settings = await Settings.findOne({ where: { userId } });
    if (settings) {
      await settings.update(data);
    } else {
      settings = await Settings.create({ ...data, userId });
    }

    return new Response(JSON.stringify(settings), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
