import { Activity, Utensils, Zap, Flame } from "lucide-react"

interface StatsProps {
  activities: any[]
  dietEntries: any[]
}

export function WeeklyInsight({ activities, dietEntries }: StatsProps) {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const dateStr = sevenDaysAgo.toISOString().split("T")[0]

  const recentActs = activities.filter(a => a.date >= dateStr)
  const recentDiet = dietEntries.filter(d => d.date >= dateStr)

  const burned = recentActs.reduce((sum, a) => sum + (a.calories || 0), 0)
  const consumed = recentDiet.reduce((sum, d) => sum + (d.calories || 0), 0)
  const workoutCount = recentActs.length

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] mt-6">
      <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        Weekly Insight
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-4">
            <Activity className="w-6 h-6" />
          </div>
          <p className="text-2xl font-black text-white">{workoutCount}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Workouts</p>
        </div>

        <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 mb-4">
            <Flame className="w-6 h-6" />
          </div>
          <p className="text-2xl font-black text-white">{burned}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">kcal Burned</p>
        </div>

        <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-4">
            <Utensils className="w-6 h-6" />
          </div>
          <p className="text-2xl font-black text-white">{consumed}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">kcal Consumed</p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
        <p className="text-sm text-blue-200 text-center font-medium italic">
          "{burned > consumed ? "You're burning more than you're eating. Great for weight loss!" : "Focus on more activity to balance your caloric intake."}"
        </p>
      </div>
    </div>
  )
}
