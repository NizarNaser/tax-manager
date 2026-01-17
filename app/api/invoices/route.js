import dbConnect from "../../../lib/db";
import Invoice from "../../../models/Invoice";
import cloudinary from "../../../lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").split(",");
  return adminEmails.includes(session.user.email);
}

export async function POST(req) {
  if (!(await isAdmin())) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const data = await req.json();
    await dbConnect();

    if (!data.image) throw new Error("Image is required");

    const result = await cloudinary.uploader.upload(data.image, { folder: "tax_invoices" });

    const invoice = await Invoice.create({
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
  if (!(await isAdmin())) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    await dbConnect();
    const invoices = await Invoice.find().sort({ date: -1 });
    return new Response(JSON.stringify(invoices), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
