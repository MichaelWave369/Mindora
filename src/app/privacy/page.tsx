export default function PrivacyPage() {
  return (
    <section data-testid="privacy-page" className="card space-y-3">
      <h2 className="text-xl font-semibold">Privacy & Local Storage</h2>
      <p className="text-sm">
        Mindora is local-first. Your entries, mood logs, breathing data, resources, and
        uploaded PDFs are stored in your browser IndexedDB on this device.
      </p>
      <ul className="list-disc pl-5 text-sm">
        <li>No telemetry.</li>
        <li>No third-party analytics.</li>
        <li>No automatic cloud uploads.</li>
      </ul>
      <p className="text-sm">
        You can export backups from Settings and delete all local data any time with the
        <strong> Delete all data</strong> action.
      </p>
      <p className="text-sm text-slate-600">
        Not medical advice. Not a substitute for a licensed professional.
      </p>
    </section>
  );
}
