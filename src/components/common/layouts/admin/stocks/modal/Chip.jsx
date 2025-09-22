export default function Chip({ children, tone = 'slate' }) {
  const TONE = {
    slate: 'bg-slate-50 text-slate-700 ring-slate-200',
    violet: 'bg-violet-50 text-violet-700 ring-violet-200',
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[11px] ring-1 ${TONE}`}>
      {children}
    </span>
  );
}
