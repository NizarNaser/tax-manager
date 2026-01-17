import dbConnect from "../../../lib/db";
import Settings from "../../../models/Settings";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").split(",");
  return adminEmails.includes(session.user.email);
}

export async function GET() {
  if (!(await isAdmin())) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    await dbConnect();
    const settings = await Settings.findOne();
    return new Response(JSON.stringify(settings || {}), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  if (!(await isAdmin())) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const data = await req.json();
    await dbConnect();

    let settings = await Settings.findOne();
    if (settings) {
      settings = await Settings.findOneAndUpdate({}, data, { new: true });
    } else {
      settings = await Settings.create(data);
    }

    return new Response(JSON.stringify(settings), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
