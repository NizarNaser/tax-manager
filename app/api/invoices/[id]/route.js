import dbConnect from "../../../../lib/db";
import Invoice from "../../../../models/Invoice";

export async function GET(req, { params }) {
  await dbConnect();

  // params أصبح Promise، لذلك نفتحها قبل الاستخدام
  const { id } = await params; // أو استخدام destructuring مع await

  try {
    const invoice = await Invoice.findById(id).lean();
    if (!invoice) {
      return new Response(JSON.stringify({ message: "Invoice not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(invoice), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
    const data = await req.json();
    const updatedInvoice = await Invoice.findByIdAndUpdate(id, data, { new: true });

    if (!updatedInvoice) {
      return new Response(JSON.stringify({ message: "Invoice not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedInvoice), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return new Response(JSON.stringify({ message: "Invoice not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Invoice deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
