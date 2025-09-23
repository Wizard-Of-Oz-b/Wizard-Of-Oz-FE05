import { LineChart, Line, BarChart, Bar, AreaChart, Area } from "recharts";

export default function KpiCard({
  icon,
  title,
  value,
  change,
  chartType = "line",
  data = [],
}) {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="rounded-2xl bg-admintheme-violet/30 backdrop-blur-md border border-white/10 shadow p-5 flex flex-col gap-3 min-w-0">
      <div className="flex items-center gap-2 text-admintheme-violet-light">
        {icon}
        <span className="text-sm">{title}</span>
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-green-300">{change}</div>
      </div>

      {/* 고정 크기 미니 차트 */}
      <div className="w-full overflow-hidden">
        {safeData.length > 0 ? (
          <>
            {chartType === "line" && (
              <LineChart width={260} height={80} data={safeData}>
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#c4b5fd"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}

            {chartType === "bar" && (
              <BarChart width={260} height={80} data={safeData}>
                <Bar dataKey="y" fill="#a78bfa" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}

            {chartType === "area" && (
              <AreaChart width={260} height={80} data={safeData}>
                <Area
                  type="monotone"
                  dataKey="y"
                  stroke="#ddd6fe"
                  fill="#7c3aed55"
                  strokeWidth={2}
                />
              </AreaChart>
            )}
          </>
        ) : (
          <div className="h-20 flex items-center justify-center text-xs text-admintheme-violet-light">
            데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
