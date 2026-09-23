export const payment = Object.freeze({
  kind: 'payment', name: 'dgr_sandbox_payment',
  description: 'Simulate a USD payment within DGR policy. Requires a previously attached sandbox invoice. No real money moves.',
  fields: Object.freeze(['invoiceId', 'destination', 'amountMinor', 'currency']),
  parameters: {
    type: 'object', additionalProperties: false,
    required: ['invoiceId', 'destination', 'amountMinor', 'currency'],
    properties: {
      invoiceId: { type: 'string', pattern: '^[A-Za-z0-9_-]{1,64}$' },
      destination: { type: 'string', pattern: '^[A-Za-z0-9_-]{1,64}$' },
      amountMinor: { type: 'integer', minimum: 1, maximum: 1000000, description: 'USD cents: 500 means $5.00.' },
      currency: { type: 'string', enum: ['USD'] },
    },
  },
});
