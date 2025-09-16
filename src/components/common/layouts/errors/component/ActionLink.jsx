export default function ActionLink({ href, icon, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 h-11 rounded-xl bg-gray-900 text-white px-4 text-sm font-medium hover:bg-gray-800"
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}
