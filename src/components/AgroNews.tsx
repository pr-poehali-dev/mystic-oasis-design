import { useState, useEffect } from "react"
import Icon from "@/components/ui/icon"

const API_URL = "https://functions.poehali.dev/3f5b0d54-74f3-4a03-a2a4-4a14546347a8"

interface NewsItem {
  title: string
  link: string
  pubdate?: string
  image?: string
}

function formatDate(raw?: string) {
  if (!raw) return ""
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
}

export default function AgroNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((data) => setNews(data.news || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">
          Источник: vesti365.ru
        </p>
        <h2 className="text-3xl sm:text-4xl font-normal tracking-[-0.03em] text-black mb-10">
          Новости агросектора России
        </h2>

        {loading && (
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-gray-400 text-sm">Не удалось загрузить новости. Попробуйте позже.</p>
        )}

        {!loading && !error && (
          <div className="grid sm:grid-cols-2 gap-4">
            {news.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col justify-between gap-3"
              >
                <p className="text-base text-black leading-[150%] group-hover:text-[#004FE5] transition-colors line-clamp-3">
                  {item.title}
                </p>
                <div className="flex items-center justify-between">
                  {item.pubdate ? (
                    <span className="text-xs font-mono text-gray-400">
                      {formatDate(item.pubdate)}
                    </span>
                  ) : (
                    <span />
                  )}
                  <Icon name="ArrowUpRight" size={16} className="text-gray-300 group-hover:text-[#004FE5] transition-colors" />
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="https://vesti365.ru/novosti-agro-rossii/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-black transition-colors"
          >
            Все новости
            <Icon name="ArrowRight" size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
