// Generates the home-screen PNG icons from the brand mark (cooking-pot, sage on charcoal).
import sharp from 'sharp';
const P = '<path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="m4 8 16-4"/><path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/>';
const mk = (scale, off) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#24221F"/><g transform="translate(${off} ${off}) scale(${scale})" fill="none" stroke="#A9B89B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${P}</g></svg>`);
const full = mk(12.5, 106), mask = mk(10, 136);
await sharp(full).resize(180).png().toFile('public/icons/apple-touch-icon-180.png');
await sharp(full).resize(192).png().toFile('public/icons/icon-192.png');
await sharp(full).resize(512).png().toFile('public/icons/icon-512.png');
await sharp(mask).resize(512).png().toFile('public/icons/icon-maskable-512.png');
