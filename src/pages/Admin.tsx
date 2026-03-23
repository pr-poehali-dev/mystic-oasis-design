import { useState } from "react"

const API_URL = "https://functions.poehali.dev/88c9934c-310c-48a7-8416-d4d47cb3db4e"

export default function Admin() {
  const [password, setPassword] = useState("")
  const [authed, setAuthed] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)

  const [value, setValue] = useState("")
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [submitStatus, setSubmitStatus] = useState<"idle" | "ok" | "error">("idle")
  const [submitLoading, setSubmitLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError("")
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", password }),
    })
    const data = await res.json()
    setLoginLoading(false)
    if (data.ok) {
      setAuthed(true)
    } else {
      setLoginError("Неверный пароль")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitLoading(true)
    setSubmitStatus("idle")
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", password, value: parseFloat(value), date }),
    })
    const data = await res.json()
    setSubmitLoading(false)
    if (data.ok) {
      setSubmitStatus("ok")
      setValue("")
    } else {
      setSubmitStatus("error")
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-normal tracking-[-0.03em] text-black mb-1">Админка</h1>
          <p className="text-sm text-gray-400 mb-6">Агро Индекс</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                autoFocus
              />
              {loginError && (
                <p className="text-red-500 text-xs mt-2">{loginError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loginLoading ? "Входим..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-normal tracking-[-0.03em] text-black mb-1">Новое значение</h1>
        <p className="text-sm text-gray-400 mb-6">Агро Индекс</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
              Дата
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
              Значение индекса
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="например: 1000000000"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          {submitStatus === "ok" && (
            <p className="text-green-600 text-sm">Значение сохранено!</p>
          )}
          {submitStatus === "error" && (
            <p className="text-red-500 text-sm">Ошибка при сохранении</p>
          )}

          <button
            type="submit"
            disabled={submitLoading || !value || !date}
            className="w-full py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {submitLoading ? "Сохраняем..." : "Сохранить"}
          </button>
        </form>

        <button
          onClick={() => setAuthed(false)}
          className="mt-4 text-xs text-gray-300 hover:text-gray-500 transition-colors w-full text-center"
        >
          Выйти
        </button>
      </div>
    </div>
  )
}
