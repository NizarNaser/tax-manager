export function serializeInvoice(invoice) {
  const { id, ...rest } = invoice.toJSON();
  return { ...rest, _id: String(id) };
}
