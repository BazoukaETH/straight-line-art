import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, CartesianGrid, Legend } from "recharts";

export function Spark({ data, color = "#3B82F6", height = 40 }: { data: number[] | { v: number }[]; color?: string; height?: number }) {
  const series = (data as Array<number | { v: number }>).map((d, i) =>
    typeof d === "number" ? { i, v: d } : { i, v: d.v }
  );
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={series} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MiniBars({ data, color = "#3B82F6", height = 160 }: { data: { name: string; value: number }[]; color?: string; height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
          <CartesianGrid vertical={false} stroke="#eef0f3" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <ReTooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StackedRevenue({
  data,
  series,
  height = 260,
}: {
  data: Array<Record<string, number | string>>;
  series: { key: string; color: string }[];
  height?: number;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="#eef0f3" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
          <ReTooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => `EGP ${new Intl.NumberFormat("en-US").format(v)}`} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} stackId="rev" fill={s.color} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
