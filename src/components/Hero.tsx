import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

function GodRaysBackground() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [GodRays, setGodRays] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    import("@paper-design/shaders-react")
      .then((m) => setGodRays(() => m.GodRays))
      .catch(() => {})
  }, [])

  if (!GodRays) return <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-white" />

  return (
    <GodRays
      colorBack="#00000000"
      colors={["#FFFFFF6E", "#F3F3F3F0", "#8A8A8A", "#989898"]}
      colorBloom="#FFFFFF"
      offsetX={0.85}
      offsetY={-1}
      intensity={1}
      spotty={0.45}
      midSize={10}
      midIntensity={0}
      density={0.12}
      bloom={0.15}
      speed={1}
      scale={1.6}
      frame={3332042.8159981333}
      style={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0 }}
    />
  )
}

export default function Hero() {
  const handleScroll = () => {
    const section = document.getElementById("analytics")
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
      {/* GodRays Background */}
      <div className="absolute inset-0">
        <GodRaysBackground />
      </div>

      {/* Admin link */}
      <div className="absolute top-4 right-4 z-10">
        <Link
          to="/admin"
          className="text-xs font-mono text-gray-400 hover:text-black transition-colors px-3 py-1.5 rounded-full border border-gray-200 bg-white/60 backdrop-blur-sm"
        >
          Войти
        </Link>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[90%] tracking-[-0.03em] text-black mix-blend-exclusion max-w-2xl">
          Аналитика и новости агрорынка
        </h1>

        <p className="text-base sm:text-lg md:text-xl leading-[160%] text-black max-w-2xl px-4">
          Агро Индекс — сервис для тех, кто принимает решения в агробизнесе. Актуальные данные, аналитика рынков и новости отрасли в одном месте.
        </p>

        <motion.div className="inline-block relative">
          <motion.div
            style={{ borderRadius: "100px" }}
            className="absolute inset-0 bg-[#004FE5]"
          />
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={handleScroll}
            className="h-15 px-6 sm:px-8 py-3 text-lg sm:text-xl font-regular text-[#E3E3E3] tracking-[-0.01em] relative"
          >
            Перейти к аналитике
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}