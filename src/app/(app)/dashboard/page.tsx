export default function DashboardPage() {
  return (
    <div className="mx-auto w-[min(100%-2rem,var(--maxw-wide))] px-4 py-12">
      <h1 className="font-display text-3xl font-bold" style={{ color: "var(--ink)" }}>
        Dashboard
      </h1>
      <p className="mt-4 glass p-6 text-sm" style={{ color: "var(--ink-soft)" }}>
        Authenticated progress, bookmarks, and notes ship in Milestone 2.
      </p>
    </div>
  );
}
