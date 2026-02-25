import Link from 'next/link';

export function DangerPanel() {
  return (
    <div className="card border-red-300 bg-red-50">
      <h2 className="font-semibold text-red-800">If you&apos;re in danger</h2>
      <p className="mt-1 text-sm">
        Call local emergency services immediately. You can also use your Crisis
        Resources list and contact your trusted people now.
      </p>
      <Link className="btn mt-3 inline-block" href="/resources">
        Open Crisis Resources
      </Link>
    </div>
  );
}
