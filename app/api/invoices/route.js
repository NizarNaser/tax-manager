import dbConnect from "../../../lib/db";
import Invoice from "../../../models/Invoice";
import { saveBase64Image } from "../../../lib/localUpload";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { serializeInvoice } from "../../../utils/serialize";

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

    const imageUrl = await saveBase64Image(data.image, "invoices");

    const invoice = await Invoice.create({
      userId,
      type: data.type,
      title: data.title,
      amount: data.amount,
      date: data.date,
      description: data.description || "",
      imageUrl,
    });

    return new Response(JSON.stringify(serializeInvoice(invoice)), { status: 201 });
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
    const invoices = await Invoice.findAll({ where: { userId }, order: [["date", "DESC"]] });
    return new Response(JSON.stringify(invoices.map(serializeInvoice)), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
