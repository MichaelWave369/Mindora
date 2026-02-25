'use client';

export default function PrintPacketPage() {
  return (
    <section className="card print:border-0">
      <h2 className="font-semibold">Wellness Packet (Printable)</h2>
      <p className="text-sm">Clean printable layout for local export.</p>
      <button className="btn mt-2" onClick={() => window.print()}>Print Wellness Packet</button>
    </section>
  );
}
