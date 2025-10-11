import { LockKeyhole, Ban, ShieldAlert, ClockAlert, WifiOff } from "lucide-react";

export function pickIcon(status) {
  if (status === 401) return LockKeyhole;
  if (status === 403) return Ban;
  if (status === 404) return ShieldAlert;
  if (status === 429) return ClockAlert;
  if (status === 503) return WifiOff;
  return ShieldAlert;
}
