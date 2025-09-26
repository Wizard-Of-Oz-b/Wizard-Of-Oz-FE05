import { Crown, Shield, Headset, UserRound } from "lucide-react";

// 서버/UI에서 들어올 수 있는 다양한 표기를 정규화
const ROLE_ALIASES = {
  super: "admin",
  superadmin: "admin",
  admin: "admin",

  page_admin: "manager",
  manager: "manager",

  cs: "cs",
  cs_admin: "cs",

  customer: "user",
  user: "user",
};

const ROLE_LABELS = {
  admin: "슈퍼관리자",
  manager: "페이지관리자",
  cs: "CS관리자",
  user: "일반회원",
};

const ROLE_ICON = {
  admin: Crown,
  manager: Shield,
  cs: Headset,
  user: UserRound,
};

// tone: 'soft' | 'solid' | 'outline'
// size: 'xs' | 'sm' | 'md'
export default function RoleBadge({ role, tone = "soft", size = "xs", className = "" }) {
  const key = ROLE_ALIASES[String(role || "").toLowerCase()] || "user";
  const label = ROLE_LABELS[key] || key;
  const Icon = ROLE_ICON[key] || UserRound;

  const base = "inline-flex items-center gap-1.5 rounded-full font-semibold ring-1";
  const sizes = {
    xs: "px-2 py-0.5 text-[10px] leading-4",
    sm: "px-2.5 py-1 text-[11px]",
    md: "px-3 py-1.5 text-xs",
  };

  const palettes = {
    admin: {
      soft: "bg-amber-100 text-amber-900 ring-amber-200",
      solid: "bg-amber-500 text-white ring-amber-500",
      outline: "bg-white text-amber-700 ring-amber-300",
    },
    manager: {
      soft: "bg-violet-100 text-violet-900 ring-violet-200",
      solid: "bg-violet-600 text-white ring-violet-600",
      outline: "bg-white text-violet-700 ring-violet-300",
    },
    cs: {
      soft: "bg-fuchsia-100 text-fuchsia-900 ring-fuchsia-200",
      solid: "bg-fuchsia-600 text-white ring-fuchsia-600",
      outline: "bg-white text-fuchsia-700 ring-fuchsia-300",
    },
    user: {
      soft: "bg-slate-100 text-slate-700 ring-slate-200",
      solid: "bg-slate-700 text-white ring-slate-700",
      outline: "bg-white text-slate-700 ring-slate-300",
    },
  };

  return (
    <span className={`${base} ${sizes[size]} ${palettes[key][tone]} ${className}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
