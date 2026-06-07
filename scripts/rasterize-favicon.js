// One-off SVG -> PNG rasterizer (no external deps). Used to bake favicon.png + apple-touch-icon.png
// from public/favicon.svg. Run with:  node scripts/rasterize-favicon.js
// Re-run only if the SVG changes.

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function renderFavicon(size) {
  const W = size;
  const H = size;
  const stride = W * 4 + 1;
  const raw = Buffer.alloc(stride * H);

  const halo = (nx, ny) => {
    const t = (nx + ny) * 0.5 + 0.5;
    if (t < 0.5) {
      const k = t / 0.5;
      return [
        Math.round(34 + (232 - 34) * k),
        Math.round(211 + (121 - 211) * k),
        Math.round(238 + (249 - 238) * k),
      ];
    }
    const k = (t - 0.5) / 0.5;
    return [
      Math.round(232 + (252 - 232) * k),
      Math.round(121 + (211 - 121) * k),
      Math.round(249 + (77 - 249) * k),
    ];
  };

  const tilePad = Math.round(size * 0.094);
  const tileR = Math.round(size * 0.20);
  const tileX0 = tilePad;
  const tileY0 = tilePad;
  const tileX1 = W - tilePad;
  const tileY1 = H - tilePad;

  for (let y = 0; y < H; y++) {
    raw[y * stride] = 0;
    for (let x = 0; x < W; x++) {
      let r, g, b, a;
      const inTile = x >= tileX0 && x < tileX1 && y >= tileY0 && y < tileY1;
      if (!inTile) {
        const nx = (x - W / 2) / (W / 2);
        const ny = (y - H / 2) / (H / 2);
        if (Math.hypot(nx, ny) > 1) {
          r = 0; g = 0; b = 0; a = 0;
        } else {
          [r, g, b] = halo(nx, ny);
          a = 255;
        }
      } else {
        const k = ((x - tileX0) / (tileX1 - tileX0) + (y - tileY0) / (tileY1 - tileY0)) * 0.5;
        const base = 2 + (15 - 2) * k;
        r = Math.round(base);
        g = Math.round(base);
        b = Math.round(base + 2);
        a = 255;
        const sx = (x - tileX0) / (tileX1 - tileX0);
        const sy = (y - tileY0) / (tileY1 - tileY0);
        const sd = Math.hypot(sx, sy) / Math.SQRT2;
        const shimmer = Math.max(0, 1 - sd) * 0.18;
        r = Math.min(255, r + shimmer * 255);
        g = Math.min(255, g + shimmer * 255);
        b = Math.min(255, b + shimmer * 255);
        const dx = Math.max(0, Math.max(tileX0 + tileR - x, x - (tileX1 - tileR - 1)));
        const dy = Math.max(0, Math.max(tileY0 + tileR - y, y - (tileY1 - tileR - 1)));
        if (Math.hypot(dx, dy) > tileR) {
          r = 0; g = 0; b = 0; a = 0;
        }
      }
      const o = y * stride + 1 + x * 4;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; raw[o + 3] = a;
    }
  }

  stampWS(raw, W, H, stride);

  const idat = zlib.deflateSync(raw, { level: 9 });
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function putPx(raw, W, stride, x, y) {
  if (x < 0 || y < 0 || x >= W || y >= W) return;
  const o = y * stride + 1 + x * 4;
  raw[o] = 255; raw[o + 1] = 255; raw[o + 2] = 255; raw[o + 3] = 255;
}

function fillRect(raw, W, stride, x0, y0, x1, y1) {
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) putPx(raw, W, stride, x, y);
}

function polygonFill(raw, W, stride, pts) {
  let minY = Infinity, maxY = -Infinity;
  for (const [, py] of pts) { if (py < minY) minY = py; if (py > maxY) maxY = py; }
  minY = Math.max(0, Math.floor(minY));
  maxY = Math.min(W - 1, Math.ceil(maxY));
  for (let y = minY; y <= maxY; y++) {
    const xs = [];
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i];
      const [xj, yj] = pts[j];
      if (yi === yj) continue;
      if ((yi > y) !== (yj > y)) {
        const x = xi + ((y - yi) * (xj - xi)) / (yj - yi);
        xs.push(x);
      }
    }
    if (xs.length < 2) continue;
    xs.sort((a, b) => a - b);
    for (let k = 0; k < xs.length; k += 2) {
      const x0 = Math.max(0, Math.ceil(xs[k]));
      const x1 = Math.min(W, Math.ceil(xs[k + 1] || xs[k]));
      for (let x = x0; x < x1; x++) putPx(raw, W, stride, x, y);
    }
  }
}

// Centered, bold block-letter "W" + "S" using polygon fills.
function stampWS(raw, W, H, stride) {
  const tileX0 = Math.round(W * 0.094);
  const tileY0 = Math.round(H * 0.094);
  const tileX1 = W - tileX0;
  const tileY1 = H - tileY0;
  const tileW = tileX1 - tileX0;
  const tileH = tileY1 - tileY0;

  const totalW = Math.round(tileW * 0.70);
  const totalH = Math.round(tileH * 0.62);
  const gap = Math.round(totalW * 0.05);
  const charW = Math.floor((totalW - gap) / 2);
  const charH = totalH;
  const t = Math.max(2, Math.round(charH * 0.24));

  const blockX = Math.round((W - totalW) / 2);
  const blockY = Math.round((H - totalH) / 2) - Math.round(H * 0.02);

  drawW(raw, W, stride, blockX, blockY, charW, charH, t);
  drawS(raw, W, stride, blockX + charW + gap, blockY, charW, charH, t);
}

function drawW(raw, W, stride, x, y, w, h, t) {
  // Two outer diagonals + inner V down to the baseline.
  // Left leg
  polygonFill(raw, W, stride, [
    [x, y],
    [x + t, y],
    [x + w * 0.18 + t, y + h],
    [x + w * 0.18, y + h],
  ]);
  // Right leg
  polygonFill(raw, W, stride, [
    [x + w - t, y],
    [x + w, y],
    [x + w * 0.82, y + h],
    [x + w * 0.82 - t, y + h],
  ]);
  // Inner V left half
  polygonFill(raw, W, stride, [
    [x + w * 0.18, y + h * 0.45],
    [x + w * 0.18 + t, y + h * 0.45],
    [x + w * 0.5, y + h],
    [x + w * 0.5 - t * 0.6, y + h],
  ]);
  // Inner V right half
  polygonFill(raw, W, stride, [
    [x + w * 0.5 + t * 0.6, y + h],
    [x + w * 0.5, y + h],
    [x + w * 0.82, y + h * 0.45],
    [x + w * 0.82 - t, y + h * 0.45],
  ]);
}

function drawS(raw, W, stride, x, y, w, h, t) {
  // Three horizontal bars
  fillRect(raw, W, stride, x, y, x + w, y + t);
  fillRect(raw, W, stride, x, Math.round(y + h / 2 - t / 2), x + w, Math.round(y + h / 2 + t / 2));
  fillRect(raw, W, stride, x, y + h - t, x + w, y + h);
  // Top-left vertical stub
  fillRect(raw, W, stride, x, y, x + t, Math.round(y + h / 2));
  // Bottom-right vertical stub
  fillRect(raw, W, stride, x + w - t, Math.round(y + h / 2), x + w, y + h);
}

function writePng(outPath, size) {
  const buf = renderFavicon(size);
  fs.writeFileSync(outPath, buf);
  console.log(`Wrote ${outPath} (${size}x${size}, ${buf.length} bytes)`);
}

const outDir = path.resolve(__dirname, "..", "public");
writePng(path.join(outDir, "favicon.png"), 64);
writePng(path.join(outDir, "apple-touch-icon.png"), 180);
