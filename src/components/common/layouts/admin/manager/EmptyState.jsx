import { Shield } from "lucide-react";

export default function EmptyState({ title = "데이터가 없습니다.", desc }) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-600 mb-4">
        <Shield className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {desc && <p className="text-sm text-slate-500 mt-1">{desc}</p>}
    </div>
  );
}