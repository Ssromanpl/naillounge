// Минимальный растровый холст и PNG-кодировщик на голом Node.
// Нужен, чтобы og-превью и apple-touch-icon были настоящими файлами,
// а не битой ссылкой. Заменяются на реальные снимки одним копированием.
import { deflateSync } from 'node:zlib';

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

const crc32 = (buf) => {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

export class Canvas {
  constructor(w, h, bg = [255, 255, 255]) {
    this.w = w;
    this.h = h;
    this.px = new Uint8Array(w * h * 3);
    this.fill(0, 0, w, h, bg);
  }

  set(x, y, [r, g, b], alpha = 1) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 3;
    if (alpha >= 1) {
      this.px[i] = r; this.px[i + 1] = g; this.px[i + 2] = b;
    } else {
      this.px[i] = this.px[i] + (r - this.px[i]) * alpha;
      this.px[i + 1] = this.px[i + 1] + (g - this.px[i + 1]) * alpha;
      this.px[i + 2] = this.px[i + 2] + (b - this.px[i + 2]) * alpha;
    }
  }

  fill(x0, y0, w, h, color, alpha = 1) {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) this.set(x, y, color, alpha);
  }

  /** Вертикальный градиент — мягкий тёплый фон без блеска. */
  gradient(from, to) {
    for (let y = 0; y < this.h; y++) {
      const t = y / (this.h - 1);
      const c = [0, 1, 2].map((i) => Math.round(from[i] + (to[i] - from[i]) * t));
      this.fill(0, y, this.w, 1, c);
    }
  }

  circle(cx, cy, r, color, alpha = 1) {
    const r2 = r * r;
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) {
      for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
        const d2 = (x - cx) ** 2 + (y - cy) ** 2;
        if (d2 <= r2) this.set(x, y, color, alpha);
        else if (d2 <= (r + 1) ** 2) this.set(x, y, color, alpha * (1 - (Math.sqrt(d2) - r)));
      }
    }
  }

  /** Знак студии: ноготь-миндаль с блеском. Три фигуры, ничего лишнего. */
  mark(cx, cy, size, color) {
    const w = size * 0.52;
    const h = size * 0.78;
    const r = w / 2;
    // Тело: прямоугольник со скруглённой верхушкой и низом.
    for (let y = Math.round(cy - h / 2); y <= Math.round(cy + h / 2); y++) {
      for (let x = Math.round(cx - r); x <= Math.round(cx + r); x++) {
        const top = cy - h / 2 + r;
        const bottom = cy + h / 2 - r * 0.55;
        let inside;
        if (y < top) inside = (x - cx) ** 2 + (y - top) ** 2 <= r * r;
        else if (y > bottom) inside = (x - cx) ** 2 / (r * r) + (y - bottom) ** 2 / (r * 0.55) ** 2 <= 1;
        else inside = Math.abs(x - cx) <= r;
        if (inside) this.set(x, y, color);
      }
    }
  }

  toPNG() {
    const raw = Buffer.alloc(this.h * (this.w * 3 + 1));
    for (let y = 0; y < this.h; y++) {
      raw[y * (this.w * 3 + 1)] = 0; // filter: none
      Buffer.from(this.px.buffer, y * this.w * 3, this.w * 3).copy(raw, y * (this.w * 3 + 1) + 1);
    }
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(this.w, 0);
    ihdr.writeUInt32BE(this.h, 4);
    ihdr[8] = 8;  // бит на канал
    ihdr[9] = 2;  // truecolor RGB
    return Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      chunk('IHDR', ihdr),
      chunk('IDAT', deflateSync(raw, { level: 9 })),
      chunk('IEND', Buffer.alloc(0)),
    ]);
  }
}
