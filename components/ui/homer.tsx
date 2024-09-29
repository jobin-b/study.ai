"use client";

export default function Homer() {
  return (
    <nav className="flex flex-row align-center justify-start gap-6 p-4">
      <a
        href="/"
        className="px-4 py-2 text-lg bg-indigo-700/40 border border-indigo-500/40 rounded-lg font-bold text-indigo-200 hover:bg-indigo-800/80 transition-all"
      >
        Homer
      </a>
    </nav>
  );
}
