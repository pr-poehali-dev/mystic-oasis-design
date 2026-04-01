import { useState, useEffect } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const API_URL = "https://functions.poehali.dev/5e5acda2-923a-4477-a7fc-3f43fdc7a32c"

type Period = "week" | "month" | "year" | "all"

const PERIODS: { key: Period; label: string }[] = [
  { key: "week", label: "Неделя" },
  { key: "month", label: "Месяц" },
  { key: "year", label: "Год" },
  { key: "all", label: "Всё время" },
]

function formatValue(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value)
}

function formatDate(dateStr: string, period: Period) {
  const date = new Date(dateStr)
  if (period === "year" || period === "all") {
    return date.toLocaleDateString("ru-RU", { month: "short", year: "2-digit" })
  }
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
}

export default function AgroIndex() {
  const [period, setPeriod] = useState<Period>("week")
  const [data, setData] = useState<{ date: string; value: number }[]>([])
  const [current, setCurrent] = useState<{ value: number; date: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}?period=${period}`)
      .then((r) => r.json())
      .then((json) => {
        setCurrent(json.current)
        setData(json.history)
      })
      .finally(() => setLoading(false))
  }, [period])

  const chartData = data.map((d) => ({
    date: formatDate(d.date, period),
    value: d.value,
  }))

  const change =
    data.length >= 2
      ? ((data[data.length - 1].value - data[0].value) / data[0].value) * 100
      : null

  // Динамический domain для Y-оси: ±5% от реального диапазона данных
  const values = chartData.map((d) => d.value)
  const minVal = values.length ? Math.min(...values) : 0
  const maxVal = values.length ? Math.max(...values) : 1
  const padding = (maxVal - minVal) * 0.1 || maxVal * 0.001
  const yDomain: [number, number] = [
    Math.floor(minVal - padding),
    Math.ceil(maxVal + padding),
  ]

  return (
    <section id="analytics" className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">
          Обновляется ежедневно в 12:00 МСК
        </p>
        <h2 className="text-3xl sm:text-4xl font-normal tracking-[-0.03em] text-black mb-8">
          Агро Индекс на сегодня
        </h2>

        {/* Current value */}
        <div className="flex items-end gap-4 mb-10">
          <span className="text-5xl sm:text-6xl font-normal tracking-[-0.03em] text-black">
            {current ? formatValue(current.value) : "—"}
          </span>
          <span className="text-lg mb-2 font-mono text-gray-500">
            4,6 из 7 баллов
          </span>
          {change !== null && (
            <span
              className={`text-lg mb-2 font-mono ${
                change >= 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)}%
            </span>
          )}
        </div>

        {/* Period tabs */}
        <div className="flex gap-2 mb-6">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-mono transition-colors ${
                period === p.key
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-64 sm:h-80">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-300 text-sm">
              Загрузка...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="agroGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004FE5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#004FE5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#aaa", fontFamily: "monospace" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={yDomain}
                  tick={{ fontSize: 11, fill: "#aaa", fontFamily: "monospace" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) =>
                    new Intl.NumberFormat("ru-RU").format(v)
                  }
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontFamily: "monospace",
                  }}
                  formatter={(value: number) => [formatValue(value), "Индекс"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#004FE5"
                  strokeWidth={2}
                  fill="url(#agroGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#004FE5" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  )
}