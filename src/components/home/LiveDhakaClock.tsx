// src/components/home/LiveDhakaClock.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { MORPH_SPRING, TACTILE_SPRING } from '@/components/shared/LiquidMotion'
import {
  ArrowRight,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Sun,
  Timer,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { LiquidIcon } from '@/components/shared/LiquidIcon'

type Mode = 'CLOCK' | 'POMODORO' | 'WEATHER'
const MODES: { id: Mode; label: string }[] = [
  { id: 'CLOCK', label: 'Clock' },
  { id: 'POMODORO', label: 'Focus' },
  { id: 'WEATHER', label: 'Weather' },
]

interface Weather {
  temp: number
  humidity: number
  condition: string
  Icon: LucideIcon
}

function describe(code: number): { condition: string; Icon: LucideIcon } {
  if (code === 0) return { condition: 'Clear', Icon: Sun }
  if (code <= 2) return { condition: 'Partly cloudy', Icon: CloudSun }
  if (code === 3) return { condition: 'Overcast', Icon: Cloud }
  if (code === 45 || code === 48) return { condition: 'Haze', Icon: CloudFog }
  if (code >= 51 && code <= 67) return { condition: 'Rain', Icon: CloudRain }
  if (code >= 80 && code <= 82) return { condition: 'Showers', Icon: CloudRain }
  if (code >= 95) return { condition: 'Thunderstorm', Icon: CloudLightning }
  return { condition: 'Cloudy', Icon: Cloud }
}

const dhakaFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Dhaka',
  hourCycle: 'h23',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

function readDhaka() {
  const p = Object.fromEntries(dhakaFmt.formatToParts(new Date()).map((x) => [x.type, x.value]))
  const h24 = parseInt(p.hour, 10) % 24
  return {
    h24: String(h24).padStart(2, '0'),
    h12: String(h24 % 12 || 12),
    minute: p.minute,
    second: p.second,
    ampm: h24 >= 12 ? 'PM' : 'AM',
    date: `${p.weekday}, ${p.month} ${p.day}`,
  }
}

export function LiveDhakaClock() {
  const [now, setNow] = useState<ReturnType<typeof readDhaka> | null>(null)
  const [is24Hour, setIs24Hour] = useState(false)
  const [weather, setWeather] = useState<Weather | null>(null)
  const [mode, setMode] = useState<Mode>('CLOCK')
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60)
  const [pomodoroActive, setPomodoroActive] = useState(false)

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') setNow(readDhaka())
    }
    tick()
    const id = window.setInterval(tick, 1000)
    document.addEventListener('visibilitychange', tick)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [])

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current=temperature_2m,relative_humidity_2m,weather_code',
      { signal: ctrl.signal }
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const c = data?.current
        if (!c) return
        setWeather({
          temp: Math.round(c.temperature_2m),
          humidity: Math.round(c.relative_humidity_2m),
          ...describe(Number(c.weather_code) || 0),
        })
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [])

  useEffect(() => {
    if (!pomodoroActive) return
    const id = window.setInterval(() => {
      setPomodoroSeconds((s) => {
        if (s <= 1) {
          setPomodoroActive(false)
          return 25 * 60
        }
        return s - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [pomodoroActive])

  const pomoMin = String(Math.floor(pomodoroSeconds / 60)).padStart(2, '0')
  const pomoSec = String(pomodoroSeconds % 60).padStart(2, '0')
  const WeatherIcon = weather?.Icon ?? CloudSun

  const hour = now ? (is24Hour ? now.h24 : now.h12) : '--'
  const label = now
    ? `Current time in Dhaka: ${hour}:${now.minute}${is24Hour ? '' : ' ' + now.ampm}`
    : 'Loading Dhaka time'

  return (
    <div className="relative w-full max-w-sm sm:max-w-md">
      {/* Ambient refraction aura behind the glass enclosure */}
      <div
        className="absolute -inset-4 rounded-[44px] bg-gradient-to-tr from-sky-500/30 via-indigo-500/20 to-fuchsia-500/20 blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Liquid Glass Shell */}
      <div className="relative rounded-[32px] p-5 bg-white/[0.06] backdrop-blur-2xl backdrop-saturate-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16),inset_0_1.5px_0_rgba(255,255,255,0.34),0_30px_60px_-20px_rgba(0,0,0,0.8)]">
        {/* Status bar */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-300">
          <span className="inline-flex items-center gap-2 font-medium text-sky-300">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live Dhaka time
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-400">
            <Wifi className="h-3.5 w-3.5 text-teal-300" /> UTC+6
          </span>
        </div>

        {/* Display Screen */}
        <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#070b16] via-[#04070e] to-black px-5 pb-5 pt-4 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09),inset_0_2px_20px_rgba(0,0,0,0.75)]">
          {/* Specular diagonal reflection */}
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_40%)]"
            aria-hidden="true"
          />

          {/* Spring-Morphing Segmented Control */}
          <div
            role="tablist"
            aria-label="Display mode"
            className="relative z-10 mx-auto mb-4 flex w-fit rounded-full bg-white/[0.07] p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
          >
            {MODES.map((m) => {
              const selected = mode === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setMode(m.id)}
                  className={`relative rounded-full px-3.5 py-1 text-[11px] font-semibold transition-colors ${
                    selected ? 'text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="dhaka-clock-mode-pill"
                      transition={MORPH_SPRING}
                      className="absolute inset-0 rounded-full bg-white shadow-[0_2px_10px_rgba(255,255,255,0.35)]"
                    />
                  )}
                  <span className="relative z-10">{m.label}</span>
                </button>
              )
            })}
          </div>

          <div className="relative z-10 min-h-[132px]" role="tabpanel">
            <AnimatePresence mode="wait">
              {mode === 'CLOCK' && (
                <motion.div
                  key="CLOCK"
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-2.5"
                >
                  <div
                    role="img"
                    aria-label={label}
                    className="tabular text-[2.75rem] font-semibold leading-none tracking-tight text-white sm:text-6xl"
                  >
                    <span>{hour}</span>
                    <span className="mx-0.5 animate-pulse text-sky-300">:</span>
                    <span>{now?.minute ?? '--'}</span>
                    <span className="ml-1 align-baseline text-xl font-medium text-sky-200/80" aria-hidden="true">
                      :{now?.second ?? '--'}
                    </span>
                    {!is24Hour && now && (
                      <span className="ml-1.5 align-top text-xs font-semibold text-amber-300">{now.ampm}</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    {now?.date ?? 'Dhaka, Bangladesh'}
                    <span className="mx-2 text-slate-600" aria-hidden="true">|</span>
                    <button
                      type="button"
                      onClick={() => setIs24Hour((v) => !v)}
                      className="font-medium text-sky-300 hover:underline"
                    >
                      {is24Hour ? 'Use 12-hour' : 'Use 24-hour'}
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-3 border-t border-white/10 pt-3 text-xs text-slate-300">
                    {weather ? (
                      <>
                        <span className="inline-flex items-center gap-1.5">
                          <WeatherIcon className="h-4 w-4 text-sky-300" /> Dhaka {weather.temp}°C
                        </span>
                        <span className="text-slate-600" aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1.5">
                          <Droplets className="h-4 w-4 text-sky-300" /> {weather.humidity}% humidity
                        </span>
                      </>
                    ) : (
                      <span className="skeleton h-4 w-44 rounded-full! opacity-40" aria-label="Loading weather" />
                    )}
                  </div>
                </motion.div>
              )}

              {mode === 'POMODORO' && (
                <motion.div
                  key="POMODORO"
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-2.5 py-1"
                >
                  <div className="tabular text-5xl font-semibold tracking-tight text-amber-300 sm:text-6xl">
                    {pomoMin}:{pomoSec}
                  </div>
                  <p className="text-xs text-slate-400">
                    {pomodoroActive ? 'Focus session in progress' : 'Ready to focus · 25 minutes'}
                  </p>
                  <div className="flex justify-center gap-2 pt-1.5">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.94 }}
                      transition={TACTILE_SPRING}
                      onClick={() => setPomodoroActive((v) => !v)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-amber-300"
                    >
                      <Timer className="h-3.5 w-3.5" /> {pomodoroActive ? 'Pause' : 'Start focus'}
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.94 }}
                      transition={TACTILE_SPRING}
                      onClick={() => {
                        setPomodoroActive(false)
                        setPomodoroSeconds(25 * 60)
                      }}
                      className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/15"
                    >
                      Reset
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {mode === 'WEATHER' && (
                <motion.div
                  key="WEATHER"
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-2 py-1"
                >
                  {weather ? (
                    <>
                      <div className="tabular text-5xl font-semibold tracking-tight text-teal-200 sm:text-6xl">
                        {weather.temp}°C
                      </div>
                      <p className="inline-flex items-center gap-1.5 text-sm text-slate-200">
                        <WeatherIcon className="h-4 w-4 text-sky-300" /> Dhaka · {weather.condition}
                      </p>
                      <p className="text-xs text-slate-400">Humidity {weather.humidity}%</p>
                    </>
                  ) : (
                    <p className="pt-6 text-sm text-slate-400">Weather is unavailable right now.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Spec chips */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div className="flex items-center gap-2.5 rounded-2xl bg-white/[0.06] p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            <LiquidIcon icon={Zap} tone="amber" variant="frost" size="sm" />
            <span>USB-C powered</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl bg-white/[0.06] p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            <LiquidIcon icon={Wifi} tone="sky" variant="frost" size="sm" />
            <span>Auto-sync over WiFi</span>
          </div>
        </div>

        <Link
          href="/products"
          className="lg-btn-primary mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold"
        >
          Shop clocks &amp; gadgets <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
