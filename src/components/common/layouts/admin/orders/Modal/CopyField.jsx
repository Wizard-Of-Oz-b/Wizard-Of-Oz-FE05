import React from "react";
import { Copy, Check } from "lucide-react";

export default function CopyField({ label, value }) {
  const [copied, setCopied] = React.useState(false);

  const doCopy = async () => {
    try {
      await navigator.clipboard?.writeText(String(value ?? ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
      <div className="text-[11px] uppercase tracking-wide text-gray-400">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <code className="font-mono text-sm text-gray-800 break-all">{String(value ?? "-")}</code>
        <button
          type="button"
          onClick={doCopy}
          className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50"
          aria-label="복사하기"
          title="복사하기"
        >
          {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4 text-gray-600" />}
        </button>
      </div>
    </div>
  );
}
