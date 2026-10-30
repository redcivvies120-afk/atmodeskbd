'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap, Clock, Wifi, RefreshCw, Sun, CloudRain, Flame, Check } from 'lucide-react'

export function LiveDhakaClock() {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState({
    hour: '12',
    minute: '00',
    second: '00',
    ampm: 'PM',
    hour24: '12',
    dateStr: 'Dhaka, Bangladesh',
  })
  const [is24Hour, setIs24Hour] = useState(false)
  const [weather, setWeather] = useState({
    temp: 28,
    humidity: 64,
    condition: 'Sunny / Clear',
    icon: '🌤️',
  })
  const [activeMode, setActiveMode] = useState<'CLOCK' | 'POMODORO' | 'WEATHER'>('CLOCK')
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60)
  const [pomodoroActive, setPomodoroActive] = useState(false)

  // Fetch real-time Dhaka date & time every second
  useEffect(() => {
    setMounted(true)

    const updateClock = () => {
      const now = new Date()

      // 12-hour format parts
      const parts12 = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).formatToParts(now)

      // 24-hour format parts
      const parts24 = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).formatToParts(now)

      const hour12 = parts12.find((p) => p.type === 'hour')?.value || '12'
      const minute = parts12.find((p) => p.type === 'minute')?.value || '00'
      const second = parts12.find((p) => p.type === 'second')?.value || '00'
      const ampm = parts12.find((p) => p.type === 'dayPeriod')?.value || 'PM'
      const hour24 = parts24.find((p) => p.type === 'hour')?.value || '12'

      const dateStr = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(now)

      setTime({
        hour: hour12,
        minute,
        second,
        ampm,
        hour24,
        dateStr,
      })
    }

    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  // Optional live weather fetch for Dhaka from open-meteo (100% free, no API key needed)
  useEffect(() => {
    async function fetchDhakaWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current=temperature_2m,relative_humidity_2m,weather_code'
        )
        if (!res.ok) return
        const data = await res.json()
        if (data?.current) {
          const t = Math.round(data.current.temperature_2m)
          const h = Math.round(data.current.relative_humidity_2m)
          const code = data.current.weather_code || 0
          let cond = 'Clear'
          let ic = '☀️'
          if (code >= 1 && code <= 3) {
            cond = 'Partly Cloudy'
            ic = '🌤️'
          } else if (code >= 51 && code <= 67) {
            cond = 'Light Rain'
            ic = '🌧️'
          } else if (code >= 80) {
            cond = 'Showers'
            ic = '🌦️'
          }
          setWeather({ temp: t, humidity: h, condition: cond, icon: ic })
        }
      } catch {
        // Fallback gracefully on network limit
      }
    }
    fetchDhakaWeather()
  }, [])

  // Pomodoro countdown timer logic
  useEffect(() => {
    if (!pomodoroActive) return
    const pTimer = setInterval(() => {
      setPomodoroSeconds((prev) => {
        if (prev <= 1) {
          setPomodoroActive(false)
          return 25 * 60
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(pTimer)
  }, [pomodoroActive])

  const pomoMin = String(Math.floor(pomodoroSeconds / 60)).padStart(2, '0')
  const pomoSec = String(pomodoroSeconds % 60).padStart(2, '0')

  return (
    <div className="relative w-full max-w-sm sm:max-w-md">
      {/* Ambient glowing backdrop */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/30 to-purple-500/30 rounded-3xl blur-2xl transform -rotate-2" />

      {/* Main Clock Shell */}
      <div className="relative rounded-3xl bg-slate-950/85 border border-slate-800 p-6 backdrop-blur-xl shadow-2xl space-y-4">
        {/* Top Status Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-bold text-sky-400 tracking-wider">
              LIVE DHAKA TIME
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Wifi className="w-3.5 h-3.5 text-teal-400" />
            <span>BST (UTC+6)</span>
          </div>
        </div>

        {/* Display Screen Canvas */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-slate-800/90 text-center space-y-3 shadow-inner relative overflow-hidden">
          {/* Subtle grid lines background overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Mode Tabs inside Clock Screen */}
          <div className="flex justify-center gap-1 mb-2 relative z-10">
            <button
              onClick={() => setActiveMode('CLOCK')}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition ${
                activeMode === 'CLOCK'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Real Clock
            </button>
            <button
              onClick={() => setActiveMode('POMODORO')}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition ${
                activeMode === 'POMODORO'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Pomodoro
            </button>
            <button
              onClick={() => setActiveMode('WEATHER')}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition ${
                activeMode === 'WEATHER'
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Weather
            </button>
          </div>

          {/* MODE 1: REAL-TIME DHAKA CLOCK */}
          {activeMode === 'CLOCK' && (
            <div className="space-y-2 relative z-10">
              <div className="text-4xl sm:text-5xl font-mono font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300 select-none">
                {mounted ? (
                  <>
                    <span>{is24Hour ? time.hour24 : time.hour}</span>
                    <span className="text-sky-300 animate-pulse">:</span>
                    <span>{time.minute}</span>
                    <span className="text-2xl text-teal-300 font-bold ml-0.5">
                      :{time.second}
                    </span>
                    {!is24Hour && (
                      <span className="text-xs align-top font-bold text-amber-300 ml-1.5 uppercase">
                        {time.ampm}
                      </span>
                    )}
                  </>
                ) : (
                  <span>12:00:00 PM</span>
                )}
              </div>

              {/* Date & Location */}
              <div className="text-xs font-mono text-slate-400">
                <span>{time.dateStr}</span>
                <span className="mx-2 text-slate-600">|</span>
                <button
                  onClick={() => setIs24Hour(!is24Hour)}
                  className="text-sky-400 hover:underline cursor-pointer"
                  title="Switch 12h/24h"
                >
                  {is24Hour ? 'Switch to 12h' : 'Switch to 24h'}
                </button>
              </div>

              {/* Live Dhaka Weather Strip */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-3 text-xs font-medium text-slate-300">
                <span>
                  {weather.icon} Dhaka {weather.temp}°C
                </span>
                <span className="text-slate-600">·</span>
                <span>💧 {weather.humidity}% RH</span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400 font-semibold">● AQI 68</span>
              </div>
            </div>
          )}

          {/* MODE 2: INTERACTIVE POMODORO */}
          {activeMode === 'POMODORO' && (
            <div className="space-y-2 relative z-10 py-1">
              <div className="text-4xl sm:text-5xl font-mono font-black text-amber-400 tracking-wider">
                {pomoMin}:{pomoSec}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {pomodoroActive ? 'Focus Session in Progress...' : 'Ready to Focus (25 min)'}
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => setPomodoroActive(!pomodoroActive)}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition"
                >
                  {pomodoroActive ? 'Pause' : 'Start Focus'}
                </button>
                <button
                  onClick={() => {
                    setPomodoroActive(false)
                    setPomodoroSeconds(25 * 60)
                  }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* MODE 3: AMBIENT WEATHER */}
          {activeMode === 'WEATHER' && (
            <div className="space-y-2 relative z-10 py-1">
              <div className="text-4xl sm:text-5xl font-mono font-black text-teal-300">
                {weather.temp}°C
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {weather.icon} Dhaka, Bangladesh • {weather.condition}
              </p>
              <div className="flex justify-center gap-4 text-xs text-slate-400 pt-1">
                <span>Humidity: {weather.humidity}%</span>
                <span>Wind: 8 km/h</span>
                <span className="text-emerald-400">Air: Good</span>
              </div>
            </div>
          )}
        </div>

        {/* Product Specs Chips */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>USB-C / 5V 1A</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Auto Sync over WiFi</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/products"
          className="block w-full py-3 text-center bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md hover:opacity-95 transition"
        >
          View Desk Clocks &amp; Gadgets Collection →
        </Link>
      </div>
    </div>
  )
}
