'use client';

import { useEffect, useState } from 'react';

import { DangerPanel } from '@/components/DangerPanel';
import { db } from '@/lib/db/client';
import type { PdfAsset, ResourceItem } from '@/types';

const MAX_PDF_SIZE = 10 * 1024 * 1024;

export default function ResourcesPage() {
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [pdfs, setPdfs] = useState<PdfAsset[]>([]);
  const [type, setType] = useState<ResourceItem['type']>('hotline');
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState('');

  const refresh = async () => {
    setItems(await db.resources.toArray());
    setPdfs(await db.pdfLibrary.toArray());
  };

  useEffect(() => {
    refresh();
  }, []);

  const resetForm = () => {
    setType('hotline');
    setLabel('');
    setValue('');
    setNotes('');
    setEditingId(null);
  };

  const upsertResource = async () => {
    const payload = { type, label, value, notes };
    if (!payload.label.trim() || !payload.value.trim()) return;

    if (editingId) {
      await db.resources.update(editingId, payload);
    } else {
      await db.resources.add(payload);
    }

    resetForm();
    refresh();
  };

  const startEdit = (item: ResourceItem) => {
    setEditingId(item.id ?? null);
    setType(item.type);
    setLabel(item.label);
    setValue(item.value);
    setNotes(item.notes ?? '');
  };

  const onUploadPdf = async (file?: File) => {
    if (!file) return;

    setUploadError('');

    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are supported.');
      return;
    }

    if (file.size > MAX_PDF_SIZE) {
      setUploadError('PDF is too large. Maximum size is 10MB.');
      return;
    }

    await db.pdfLibrary.add({
      filename: file.name,
      mime: file.type,
      blob: file,
      createdAt: new Date().toISOString()
    });

    refresh();
  };

  return (
    <section className="space-y-4">
      <DangerPanel />

      <div className="card">
        <h2 className="font-semibold">Crisis resources</h2>

        <div className="mt-2 grid gap-2 md:grid-cols-4">
          <select
            aria-label="Resource type"
            className="rounded border p-2"
            value={type}
            onChange={(event) => setType(event.target.value as ResourceItem['type'])}
          >
            <option value="hotline">hotline</option>
            <option value="url">url</option>
            <option value="note">note</option>
          </select>

          <input
            aria-label="Resource label"
            className="rounded border p-2"
            placeholder="Label"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />

          <input
            aria-label="Resource value"
            className="rounded border p-2"
            placeholder="Number / URL / text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />

          <input
            aria-label="Resource notes"
            className="rounded border p-2"
            placeholder="Notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>

        <div className="mt-2 flex gap-2">
          <button className="btn" onClick={upsertResource}>
            {editingId ? 'Save resource' : 'Add resource'}
          </button>
          {editingId && (
            <button className="btn-secondary" onClick={resetForm}>
              Cancel edit
            </button>
          )}
        </div>

        <ul className="mt-3 space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.id} className="rounded border p-2">
              {item.type}: <strong>{item.label}</strong> — {item.value} <em>{item.notes}</em>
              <button
                aria-label={`Edit ${item.label}`}
                className="ml-3 underline"
                onClick={() => startEdit(item)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3 className="font-semibold">Local PDFs</h3>
        <input
          aria-label="Upload PDF"
          type="file"
          accept="application/pdf"
          onChange={(event) => onUploadPdf(event.target.files?.[0])}
          className="mt-2"
        />
        <p className="mt-1 text-xs text-slate-500">PDF only, up to 10MB.</p>
        {uploadError && <p className="text-sm text-red-700">{uploadError}</p>}
        <ul className="mt-3 space-y-2 text-sm">
          {pdfs.map((pdf) => (
            <li key={pdf.id} className="flex justify-between rounded border p-2">
              <span>{pdf.filename}</span>
              <a className="underline" href={URL.createObjectURL(pdf.blob)} download={pdf.filename}>
                Download
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
