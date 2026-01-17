import dbConnect from "../../../lib/db";
import Settings from "../../../models/Settings";

export async function GET() {
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
