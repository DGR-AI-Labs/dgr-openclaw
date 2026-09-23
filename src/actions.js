import { digest, plain } from './config.js';
import { payment } from './modules/payment.js';
import { invoice } from './modules/invoice.js';
export const modules = Object.freeze([payment, invoice]);
export function parseAction(kind, input) {
  const module = modules.find(m => m.kind === kind);
  if (!module || !plain(input) || Object.keys(input).length !== module.fields.length
    || module.fields.some(k => !Object.hasOwn(input, k))
    || Object.keys(input).some(k => !module.fields.includes(k))
    || typeof input.invoiceId !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(input.invoiceId)) {
    throw new Error('INVALID_ACTION');
  }
  let action;
  if (kind === 'payment') {
    if (typeof input.destination !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(input.destination)
      || !Number.isSafeInteger(input.amountMinor) || input.amountMinor < 1 || input.amountMinor > 1000000
      || input.currency !== 'USD') throw new Error('INVALID_ACTION');
    action = { kind, invoiceId: input.invoiceId, destination: input.destination,
      amountMinor: input.amountMinor, currency: 'USD' };
  } else {
    if (typeof input.content !== 'string' || input.content.length < 1 || input.content.length > 262144
      || !input.content.isWellFormed() || Buffer.byteLength(input.content) > 262144) throw new Error('INVALID_ACTION');
    action = { kind, invoiceId: input.invoiceId, content: input.content,
      contentHash: digest(input.content), byteLength: Buffer.byteLength(input.content) };
  }
  // Explicit ordered encoding; do not hash caller property order or debug output.
  const canonical = kind === 'payment'
    ? ['dgr-action/1', kind, action.invoiceId, action.destination, action.amountMinor, action.currency]
    : ['dgr-action/1', kind, action.invoiceId, action.byteLength, action.contentHash];
  return Object.freeze({ ...action, hash: digest(JSON.stringify(canonical)) });
}
