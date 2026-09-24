import { mkdirSync, writeFileSync } from 'node:fs';
import { deflateSync, constants } from 'node:zlib';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const width = 512;
const height = 512;
const scale = 4;
const background = [0x11, 0x18, 0x27];
const pathColor = [0x6b, 0x72, 0x80];
const gateColor = [0xe5, 0xe7, 0xeb];

// Capsules give the path and gate circular, antialiased ends.
function capsule(x, y, x1, y1, x2, y2, radius) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
  return (x - x1 - t * dx) ** 2 + (y - y1 - t * dy) ** 2 <= radius ** 2;
}

// Render 4x sample centers, then box-filter each 4x4 block into opaque RGBA.
const raw = Buffer.alloc(height * (1 + width * 4));
for (let y = 0; y < height; y++) {
  const row = y * (1 + width * 4);
  raw[row] = 0; // PNG filter: None.
  for (let x = 0; x < width; x++) {
    const sum = [0, 0, 0];
    for (let sy = 0; sy < scale; sy++) {
      for (let sx = 0; sx < scale; sx++) {
        const px = x + (sx + 0.5) / scale;
        const py = y + (sy + 0.5) / scale;
        let color = background;
        if (capsule(px, py, -16, height / 2, width * 0.45 - 16, height / 2, 16)) color = pathColor;
        if (capsule(px, py, width / 2, height * 0.2 + 24, width / 2, height * 0.8 - 24, 24)) color = gateColor;
        for (let channel = 0; channel < 3; channel++) sum[channel] += color[channel];
      }
    }
    const offset = row + 1 + x * 4;
    for (let channel = 0; channel < 3; channel++) raw[offset + channel] = Math.round(sum[channel] / (scale * scale));
    raw[offset + 3] = 255;
  }
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const result = Buffer.alloc(data.length + 12);
  result.writeUInt32BE(data.length, 0);
  body.copy(result, 4);
  result.writeUInt32BE(crc32(body), result.length - 4);
  return result;
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8; // 8 bits per channel.
ihdr[9] = 6; // RGBA; compression, filtering and interlace bytes remain zero.
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9, strategy: constants.Z_FIXED })),
  chunk('IEND', Buffer.alloc(0)),
]);
assert.ok(png.length < 512 * 1024, 'Icon exceeds ClawHub limit');
mkdirSync(new URL('../assets/', import.meta.url), { recursive: true });
writeFileSync(new URL('../assets/icon.png', import.meta.url), png);
console.log(`assets/icon.png: ${width}x${height}, 8-bit RGBA, opaque, non-interlaced, ${png.length} bytes`);
console.log('SHA-256 ' + createHash('sha256').update(png).digest('hex'));
