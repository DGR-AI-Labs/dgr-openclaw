import { createHash } from 'node:crypto';

export const configSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    maxPaymentMinor: { type: 'integer', minimum: 1, maximum: 1000000, default: 1000 },
    allowedDestinations: { type: 'array', minItems: 1, maxItems: 32, uniqueItems: true,
      items: { type: 'string', pattern: '^[A-Za-z0-9_-]{1,64}$' }, default: ['sandbox-vendor'] },
    maxAttachmentBytes: { type: 'integer', minimum: 1, maximum: 262144, default: 4096 },
  },
};
export function digest(value) {
  return createHash('sha256').update(value).digest('hex');
}
export function plain(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}
export function parseConfig(input = {}) {
  if (!plain(input) || Object.keys(input).some(k => !Object.hasOwn(configSchema.properties, k))) {
    throw new Error('DGR configuration must contain only documented policy fields.');
  }
  const maxPaymentMinor = input.maxPaymentMinor ?? 1000;
  const maxAttachmentBytes = input.maxAttachmentBytes ?? 4096;
  const allowedDestinations = input.allowedDestinations ?? ['sandbox-vendor'];
  if (!Number.isSafeInteger(maxPaymentMinor) || maxPaymentMinor < 1 || maxPaymentMinor > 1000000
    || !Number.isSafeInteger(maxAttachmentBytes) || maxAttachmentBytes < 1 || maxAttachmentBytes > 262144
    || !Array.isArray(allowedDestinations) || allowedDestinations.length < 1 || allowedDestinations.length > 32
    || allowedDestinations.some(v => typeof v !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(v))
    || new Set(allowedDestinations).size !== allowedDestinations.length
    || Object.values(input).some(v => v === null)) {
    throw new Error('DGR configuration has invalid limits or destinations.');
  }
  const destinations = Object.freeze([...allowedDestinations].sort());
  const hash = digest(JSON.stringify(['dgr-sandbox-policy/1', maxPaymentMinor, maxAttachmentBytes, destinations]));
  return Object.freeze({ maxPaymentMinor, maxAttachmentBytes, allowedDestinations: destinations, hash });
}
