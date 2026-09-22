export const invoice = Object.freeze({
  kind: 'invoice', name: 'dgr_invoice_attachment',
  description: 'Attach bounded synthetic invoice text to the local DGR sandbox. No file path or external upload is accepted.',
  fields: Object.freeze(['invoiceId', 'content']),
  parameters: {
    type: 'object', additionalProperties: false, required: ['invoiceId', 'content'],
    properties: {
      invoiceId: { type: 'string', pattern: '^[A-Za-z0-9_-]{1,64}$' },
      content: { type: 'string', minLength: 1, maxLength: 262144, description: 'Synthetic sample text only; never customer data.' },
    },
  },
});
