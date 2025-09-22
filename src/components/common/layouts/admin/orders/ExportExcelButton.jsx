import { Download } from 'lucide-react';
import { exportOrdersToXlsx } from './ordersExport';

export default function ExportExcelButton({
  orders,
  startDate,
  endDate,
  page = 1,
  filenamePrefix = 'Orders',
  className = '',
  title = '엑셀 다운로드',
}) {
  const onClick = () => {
    exportOrdersToXlsx({ orders, startDate, endDate, page, filenamePrefix });
  };

  return (
    <button
      onClick={onClick}
      className={[
        'group inline-flex items-center gap-2 rounded-xl px-4 py-2',
        'text-sm font-semibold text-white',
        'bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600',
        'shadow-[0_8px_20px_-6px_rgba(79,70,229,0.45)]',
        'hover:shadow-[0_12px_24px_-6px_rgba(79,70,229,0.55)]',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-violet-300',
        'active:scale-[0.99]',
        className,
      ].join(' ')}
      title={title}
      aria-label={title}
      type="button"
    >
      <span
        className="
          inline-flex h-6 w-6 items-center justify-center
          rounded-lg bg-white/20 ring-1 ring-white/30
          transition-transform duration-200 group-hover:rotate-12
        "
      >
        <Download className="h-4 w-4 text-white" />
      </span>
      <span>{title}</span>
    </button>
  );
}
