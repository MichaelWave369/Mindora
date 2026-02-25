'use client';

const enc = new TextEncoder();

async function deriveKey(password: string, salt: Uint8Array) {
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 250000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptBackup(payload: string, password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(payload));
  return { salt: Array.from(salt), iv: Array.from(iv), data: Array.from(new Uint8Array(cipher)) };
}

export async function decryptBackup(blob: { salt: number[]; iv: number[]; data: number[] }, password: string) {
  const key = await deriveKey(password, new Uint8Array(blob.salt));
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(blob.iv) }, key, new Uint8Array(blob.data));
  return new TextDecoder().decode(plain);
}
