// 관리자페이지 전용 로딩스피너

export default function LoadingOverlay({
  message = "권한 확인 중입니다…",
  subtext = "잠시만 기다려주세요",
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-30 w-30">
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.95), rgba(236,72,153,0.95))",
              boxShadow:
                "0 0 22px rgba(139,92,246,0.45), 0 0 36px rgba(236,72,153,0.35)",
            }}
          />
          <div className="absolute -inset-1 animate-spin">
            <div
              className="h-full w-full rounded-full"
              style={{
                background:
                  "conic-gradient(rgba(139,92,246,0.45) 0 9%, transparent 9% 25%, rgba(236,72,153,0.45) 25% 34%, transparent 34% 50%, rgba(139,92,246,0.45) 50% 59%, transparent 59% 75%, rgba(236,72,153,0.45) 75% 84%, transparent 84% 100%)",
                WebkitMask:
                  "radial-gradient(farthest-side, transparent 55%, #000 56%)",
                mask:
                  "radial-gradient(farthest-side, transparent 55%, #000 56%)",
                filter: "blur(0.3px)",
              }}
            />
          </div>
          <div
            className="absolute -inset-2 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)",
              mixBlendMode: "screen",
            }}
          />
        </div>

        <div className="text-center text-white">
          <p className="text-sm font-semibold">{message}</p>
          {subtext ? (
            <p className="mt-0.5 text-xs text-white/70">{subtext}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
