import { Link } from "react-router-dom";

export default function QuickLink({ to, icon, children }) {
  const content = (
    <div className="group flex items-center justify-between rounded-xl bg-admintheme-violet/40 backdrop-blur-md border border-white/10 px-3 py-2 hover:bg-admintheme-violet/60 transition">
      <div className="flex items-center gap-2 text-sm text-white">
        <span className="inline-flex items-center justify-center rounded-md bg-admintheme-violet-dark/60 p-1.5">
          {icon}
        </span>
        {children}
      </div>
      <span className="text-admintheme-violet-light group-hover:text-white">
        →
      </span>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}
