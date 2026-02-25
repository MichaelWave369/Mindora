'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/db/client';
import { DangerPanel } from '@/components/DangerPanel';
import type { PdfAsset, ResourceItem } from '@/types';

export default function ResourcesPage() {
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [pdfs, setPdfs] = useState<PdfAsset[]>([]);
  const [type, setType] = useState<ResourceItem['type']>('hotline');
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  const refresh = async () => {
    setItems(await db.resources.toArray());
    setPdfs(await db.pdfLibrary.toArray());
  };

  useEffect(() => { refresh(); }, []);

  const addResource = async () => {
    await db.resources.add({ type, label, value, notes });
    setLabel(''); setValue(''); setNotes('');
    refresh();
  };

  const onUploadPdf = async (file?: File) => {
    if (!file) return;
    await db.pdfLibrary.add({ filename: file.name, mime: file.type, blob: file, createdAt: new Date().toISOString() });
    refresh();
  };

  return (
    <section className="space-y-4">
      <DangerPanel />
      <div className="card">
        <h2 className="font-semibold">Crisis resources</h2>
        <div className="grid md:grid-cols-4 gap-2 mt-2">
          <select className="border rounded p-2" value={type} onChange={(e) => setType(e.target.value as any)}><option value="hotline">hotline</option><option value="url">url</option><option value="note">note</option></select>
          <input className="border rounded p-2" placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} />
          <input className="border rounded p-2" placeholder="Number / URL / text" value={value} onChange={(e) => setValue(e.target.value)} />
          <input className="border rounded p-2" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <button className="btn mt-2" onClick={addResource}>Add resource</button>
        <ul className="mt-3 text-sm space-y-2">{items.map((r) => <li key={r.id} className="border rounded p-2">{r.type}: <strong>{r.label}</strong> — {r.value} <em>{r.notes}</em></li>)}</ul>
      </div>
      <div className="card">
        <h3 className="font-semibold">Local PDFs</h3>
        <input type="file" accept="application/pdf" onChange={(e) => onUploadPdf(e.target.files?.[0])} className="mt-2" />
        <ul className="mt-3 text-sm space-y-2">
          {pdfs.map((p) => <li key={p.id} className="border rounded p-2 flex justify-between"><span>{p.filename}</span><a className="underline" href={URL.createObjectURL(p.blob)} download={p.filename}>Download</a></li>)}
        </ul>
      </div>
    </section>
  );
}
