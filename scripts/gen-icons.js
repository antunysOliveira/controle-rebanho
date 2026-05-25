const zlib = require("zlib")
const fs = require("fs")
const path = require("path")

// CRC32 table
const crcTable = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let j = 0; j < 8; j++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
  crcTable[i] = c
}
function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const t = Buffer.from(type, "ascii")
  const d = Buffer.isBuffer(data) ? data : Buffer.from(data)
  const len = Buffer.alloc(4); len.writeUInt32BE(d.length)
  const crcVal = Buffer.alloc(4); crcVal.writeUInt32BE(crc32(Buffer.concat([t, d])))
  return Buffer.concat([len, t, d, crcVal])
}

// Bitmap font — uppercase letters 5×7, 0=bg 1=fg
const GLYPHS = {
  C: [0b01110,0b10001,0b10000,0b10000,0b10000,0b10001,0b01110],
  R: [0b11110,0b10001,0b10001,0b11110,0b10100,0b10010,0b10001],
  // cow ears, head, eyes, nose for cow face
}

function createIcon(size) {
  const buf = new Uint8Array(size * size * 4).fill(0) // RGBA

  const set = (x, y, r, g, b, a = 255) => {
    if (x < 0 || x >= size || y < 0 || y >= size) return
    const i = (y * size + x) * 4
    buf[i]=r; buf[i+1]=g; buf[i+2]=b; buf[i+3]=a
  }

  const fillCircle = (cx, cy, rad, r, g, b) => {
    const r2 = rad * rad
    for (let dy = -rad; dy <= rad; dy++)
      for (let dx = -rad; dx <= rad; dx++)
        if (dx*dx + dy*dy <= r2) set(cx+dx, cy+dy, r, g, b)
  }

  const fillRect = (x, y, w, h, r, g, b) => {
    for (let dy = 0; dy < h; dy++)
      for (let dx = 0; dx < w; dx++)
        set(x+dx, y+dy, r, g, b)
  }

  // Dark green background: #1e3b15
  fillRect(0, 0, size, size, 30, 59, 21)

  // Outer ring (lighter green): #2d5a27
  fillCircle(size>>1, size>>1, Math.round(size * 0.46), 45, 90, 39)

  // White inner circle
  fillCircle(size>>1, size>>1, Math.round(size * 0.40), 255, 255, 255)

  // Draw "CR" letters in dark green
  const gScale = Math.max(1, Math.round(size / 40))
  const gW = 5 * gScale
  const gH = 7 * gScale
  const gap = gScale

  // Total width of "CR"
  const totalW = gW * 2 + gap
  const startX = ((size - totalW) >> 1)
  const startY = ((size - gH) >> 1)

  for (const [idx, ch] of ["C", "R"].entries()) {
    const rows = GLYPHS[ch]
    const ox = startX + idx * (gW + gap)
    for (let row = 0; row < rows.length; row++) {
      const bits = rows[row]
      for (let col = 0; col < 5; col++) {
        if ((bits >> (4 - col)) & 1) {
          fillRect(ox + col * gScale, startY + row * gScale, gScale, gScale, 30, 59, 21)
        }
      }
    }
  }

  // Build PNG (RGBA → RGB with white matte, no transparency needed)
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8; ihdr[9] = 2 // 8-bit RGB

  const rowBytes = 1 + size * 3
  const raw = Buffer.alloc(size * rowBytes)
  for (let y = 0; y < size; y++) {
    raw[y * rowBytes] = 0 // filter: None
    for (let x = 0; x < size; x++) {
      const s = (y * size + x) * 4
      const d = y * rowBytes + 1 + x * 3
      raw[d]   = buf[s]
      raw[d+1] = buf[s+1]
      raw[d+2] = buf[s+2]
    }
  }

  const sig = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ])
}

const out = path.join(__dirname, "..", "public")
fs.mkdirSync(out, { recursive: true })
fs.writeFileSync(path.join(out, "icon-192.png"), createIcon(192))
fs.writeFileSync(path.join(out, "icon-512.png"), createIcon(512))
console.log("icon-192.png  ✓")
console.log("icon-512.png  ✓")
