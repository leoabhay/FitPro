import { useState, useEffect } from "react"
import { Droplets, Plus } from "lucide-react"
import { saveWaterLog, getWaterLogs } from "../lib/db"

export function WaterTracker() {
  const [dailyWater, setDailyWater] = useState(0)
  const goal = 2500 // 2.5L in ml

  useEffect(() => {
    loadDailyWater()
  }, [])

  const loadDailyWater = async () => {
    const today = new Date().toISOString().split("T")[0]
    const logs = await getWaterLogs(today) as any[]
    const total = logs.reduce((sum, log) => sum + log.amount, 0)
    setDailyWater(total)
  }

  const addWater = async (amount: number) => {
    await saveWaterLog(amount)
    loadDailyWater()
  }

  const progress = Math.min((dailyWater / goal) * 100, 100)

  return (
    <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Droplets className="w-24 h-24 text-blue-400" />
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Droplets className="w-5 h-5 text-blue-400" />
          Hydration
        </h3>
        <p className="text-slate-500 text-sm mb-6 font-medium">Daily Goal: 2.5L</p>

        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-4xl font-black text-white">{dailyWater / 1000}</span>
            <span className="text-lg font-bold text-slate-500 ml-1">Liters</span>
          </div>
          <p className="text-blue-400 font-bold">{Math.round(progress)}%</p>
        </div>

        {/* Progress Bar */}
        <div className="h-4 bg-white/5 rounded-full overflow-hidden mb-8 border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => addWater(250)}
            className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group/btn"
          >
            <Plus className="w-5 h-5 text-blue-400 group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-300">250ml Glass</span>
          </button>
          <button 
            onClick={() => addWater(500)}
            className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group/btn"
          >
            <Plus className="w-5 h-5 text-blue-400 group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-300">500ml Bottle</span>
          </button>
        </div>
      </div>
    </div>
  )
}
