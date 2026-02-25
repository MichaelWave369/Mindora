'use client';

export default function PrintEntryPage() {
  return (
    <section className="card print:border-0">
      <h2 className="font-semibold">Printable Entry</h2>
      <p className="text-sm">Use your browser print dialog and save as PDF.</p>
      <button className="btn mt-2" onClick={() => window.print()}>Print / Save PDF</button>
    </section>
  );
}
