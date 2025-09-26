import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyMono({ text, short = false, className = "" }) {
  const [ok, setOk] = useState(false);
  const shown = short && text?.length > 12 ? `${text.slice(0,8)}…${text.slice(-4)}` : text;

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text || "");
      setOk(true);
      setTimeout(() => setOk(false), 1200);
    } catch {}
  }

  return (
    <span className={`inline-flex items-center gap-1 font-mono text-xs tabular-nums ${className}`}>
      <span title={text}>{shown}</span>
      <button
        type="button"
        onClick={onCopy}
        className="ml-0.5 inline-flex items-center rounded px-1 py-0.5 text-[10px] border border-gray-200 text-gray-600 hover:bg-gray-50"
      >
        {ok ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      </button>
    </span>
  );
}
