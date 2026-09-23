import { join } from 'node:path';
import { configSchema, parseConfig } from './config.js';
import { modules } from './actions.js';
import { SandboxGate, STATUS, REASONS } from './gate.js';

export default {
  id: 'dgr-gate', name: 'DGR Gate',
  description: 'Two policy-controlled synthetic finance tools. Does not govern other OpenClaw tools.',
  configSchema,
  register(api) {
    const policy = parseConfig(api.pluginConfig ?? {});
    let gate;
    let unavailable = false;
    const stateRoot = api.runtime?.state?.resolveStateDir?.();
    if (typeof stateRoot !== 'string' || !stateRoot) throw new Error('DGR requires the host state directory.');
    const config = { maxPaymentMinor: policy.maxPaymentMinor,
      maxAttachmentBytes: policy.maxAttachmentBytes, allowedDestinations: [...policy.allowedDestinations] };
    for (const module of modules) api.registerTool({
      name: module.name, label: module.name, description: module.description, parameters: module.parameters,
      async execute(callId, input) {
        let result;
        if (unavailable) result = { status: STATUS.UNAVAILABLE, reason: REASONS.STORE_UNAVAILABLE, sandbox: true, recorded: false };
        else {
          try {
            gate ??= new SandboxGate(join(stateRoot, 'dgr-sandbox', 'sandbox.sqlite'), config);
            result = gate.execute(module.kind, callId, input);
            if (['unavailable', 'uncertain'].includes(result.status)) unavailable = true;
          } catch {
            unavailable = true;
            result = { status: STATUS.UNAVAILABLE, reason: REASONS.STORE_UNAVAILABLE, sandbox: true, recorded: false };
          }
        }
        return { content: [{ type: 'text', text: JSON.stringify(result) }], details: result,
          isError: result.status !== 'simulated' };
      },
    });
    api.registerService({ id: 'dgr-sandbox-storage', start() {}, stop() {
      unavailable = true;
      if (gate) { gate.close(); gate = undefined; }
    } });
  },
};
