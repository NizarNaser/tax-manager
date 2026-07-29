import dbConnect from "../../../lib/db";
import Invoice from "../../../models/Invoice";
import cloudinary from "../../../lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const userId = session.user.email;
  try {
    const data = await req.json();
    await dbConnect();

    if (!data.image) throw new Error("Image is required");

    const result = await cloudinary.uploader.upload(data.image, { folder: "tax_invoices" });

    const invoice = await Invoice.create({
      userId,
      type: data.type,
      title: data.title,
      amount: data.amount,
      date: data.date,
      description: data.description || "",
      imageUrl: result.secure_url,
    });

    return new Response(JSON.stringify(invoice), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const userId = session.user.email;
  try {
    await dbConnect();
    const invoices = await Invoice.find({ userId }).sort({ date: -1 });
    return new Response(JSON.stringify(invoices), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
