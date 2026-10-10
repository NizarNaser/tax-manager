import dbConnect from "../../../../lib/db";
import Invoice from "../../../../models/Invoice";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { serializeInvoice } from "../../../../utils/serialize";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const userId = session.user.email;
  await dbConnect();

  const { id } = await params;

  try {
    const invoice = await Invoice.findOne({ where: { id, userId } });
    if (!invoice) {
      return new Response(JSON.stringify({ message: "Invoice not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(serializeInvoice(invoice)), { status: 200 });
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
    const invoice = await Invoice.findOne({ where: { id, userId } });

    if (!invoice) {
      return new Response(JSON.stringify({ message: "Invoice not found" }), { status: 404 });
    }

    await invoice.update(data);

    return new Response(JSON.stringify(serializeInvoice(invoice)), { status: 200 });
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
    const invoice = await Invoice.findOne({ where: { id, userId } });

    if (!invoice) {
      return new Response(JSON.stringify({ message: "Invoice not found" }), { status: 404 });
    }

    await invoice.destroy();

    return new Response(JSON.stringify({ message: "Invoice deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
