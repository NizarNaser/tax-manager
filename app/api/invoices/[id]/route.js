import dbConnect from "../../../../lib/db";
import Invoice from "../../../../models/Invoice";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const userId = session.user.email;
  await dbConnect();

  // params أصبح Promise، لذلك نفتحها قبل الاستخدام
  const { id } = await params; // أو استخدام destructuring مع await

  try {
    const invoice = await Invoice.findOne({ _id: id, userId }).lean();
    if (!invoice) {
      return new Response(JSON.stringify({ message: "Invoice not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(invoice), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const userId = session.user.email;
  await dbConnect();
  const { id } = await params;

  try {
    const data = await req.json();
    const updatedInvoice = await Invoice.findOneAndUpdate({ _id: id, userId }, data, { new: true });

    if (!updatedInvoice) {
      return new Response(JSON.stringify({ message: "Invoice not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedInvoice), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const userId = session.user.email;
  await dbConnect();
  const { id } = await params;

  try {
    const deletedInvoice = await Invoice.findOneAndDelete({ _id: id, userId });

    if (!deletedInvoice) {
      return new Response(JSON.stringify({ message: "Invoice not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Invoice deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
