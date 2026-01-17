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
