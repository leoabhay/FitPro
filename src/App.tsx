import { useState, useEffect } from "react"
import { initDB, getActivities, getDietEntries, getGoals, getProfile, getWaterLogs } from "./lib/db"
import { ActivityForm, DietForm } from "./components/Forms"
import { GoalsTracker } from "./components/Goals"
import { WaterTracker } from "./components/WaterTracker"
import { Profile } from "./components/Profile"
import { WeeklyInsight } from "./components/WeeklyInsight"
import { NotificationPanel } from "./components/Notifications"
import { LayoutDashboard, PlusCircle, Target, TrendingUp, User, Bell, Activity, Utensils, Droplets } from "lucide-react"

function App() {
  const [dbReady, setDbReady] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [activities, setActivities] = useState<any[]>([])
  const [dietEntries, setDietEntries] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [dailyWater, setDailyWater] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const startDB = async () => {
      await initDB()
      setDbReady(true)
      loadData()
    }
    startDB()
  }, [])

  const loadData = async () => {
    const today = new Date().toISOString().split("T")[0]
    const [acts, diets, gls, prof, water] = await Promise.all([
      getActivities(),
      getDietEntries(),
      getGoals(),
      getProfile(),
      getWaterLogs(today)
    ])
    setActivities(acts as any[])
    setDietEntries(diets as any[])
    setGoals(gls as any[])
    setProfile(prof)
    const waterAmount = (water as any[]).reduce((sum, log) => sum + log.amount, 0)
    setDailyWater(waterAmount)

    // Generate dynamic notifications
    const newNotifs = []
    const actsList = acts as any[]
    if (waterAmount < 2000) {
      newNotifs.push({
        id: "h2o",
        title: "Hydration Alert",
        message: `You've only had ${waterAmount / 1000}L of water today. Reach for 2L!`,
        type: "warning",
        time: "Just now",
        read: false
      })
    }
    if (actsList.length > 0) {
      const lastAct = actsList[actsList.length - 1]
      newNotifs.push({
        id: "act",
        title: "Great Workout!",
        message: `You burned ${lastAct.calories} kcal doing ${lastAct.exercise}. Keep it up!`,
        type: "success",
        time: "Achievement",
        read: false
      })
    }
    setNotifications(newNotifs)
  }

  if (!dbReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold">FP</div>
        </div>
      </div>
    )
  }

  const totalCaloriesBurned = activities.reduce((sum, a) => sum + (a.calories || 0), 0)
  const totalCaloriesConsumed = dietEntries.reduce((sum, d) => sum + (d.calories || 0), 0)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Sidebar / Desktop Nav */}
      <aside className="fixed left-0 top-0 bottom-0 w-24 hidden lg:flex flex-col items-center py-10 bg-slate-900/50 border-r border-white/5 backdrop-blur-3xl z-50">
        <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-500/20 mb-12 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
          FP
        </div>
        <nav className="flex flex-col gap-8">
          {[
            { id: "dashboard", icon: LayoutDashboard, type: "tab" },
            { id: "log", icon: PlusCircle, type: "tab" },
            { id: "goals", icon: Target, type: "tab" },
            { id: "notifications", icon: Bell, type: "action", action: () => setShowNotifications(true) },
            // { id: "profile", icon: User, type: "tab" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => item.type === "tab" ? setActiveTab(item.id) : item.action?.()}
              className={`p-4 rounded-2xl transition-all relative group ${
                (item.type === "tab" && activeTab === item.id) || (item.id === "notifications" && showNotifications)
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              <item.icon className="w-6 h-6" />
              {item.id === "notifications" && notifications.some(n => !n.read) && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-slate-900 rounded-full" />
              )}
              {/* Tooltip */}
              <span className="absolute left-full ml-4 px-3 py-1 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 capitalize">
                {item.id}
              </span>
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${
              activeTab === "profile" ? "bg-blue-500 border-transparent text-white" : "bg-slate-800 border-white/10 text-slate-400"
            }`}
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-24 pb-24 lg:pb-0">
        <header className="px-6 py-8 flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight capitalize">
              {activeTab === "dashboard" ? `Welcome Back${profile?.name ? ', ' + profile.name.split(' ')[0] : ''}!` : activeTab}
            </h1>
            <p className="text-slate-500 text-sm font-medium">Keep up the momentum!</p>
          </div>
          <div className="lg:hidden flex items-center gap-4">
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-2 text-slate-400"
            >
              <Bell className="w-6 h-6" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-slate-950 rounded-full" />
              )}
            </button>
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              FP
            </div>
          </div>
        </header>

        <section className="px-6 max-w-7xl mx-auto pb-12">
          {activeTab === "dashboard" && (
            <div className="grid gap-6">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-linear-to-br from-blue-600 to-blue-700 p-6 rounded-4xl shadow-xl shadow-blue-500/10 relative overflow-hidden group">
                  <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
                  <p className="text-blue-100 font-bold mb-1 uppercase tracking-wider text-[10px]">Calories Burned</p>
                  <div className="flex items-end gap-2 text-white">
                    <span className="text-5xl font-black">{totalCaloriesBurned}</span>
                    <span className="text-lg font-bold opacity-80 mb-1 text-blue-200">kcal</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-white/5 p-6 rounded-4xl shadow-xl relative overflow-hidden group">
                  <p className="text-slate-500 font-bold mb-1 uppercase tracking-wider text-[10px]">Calories Consumed</p>
                  <div className="flex items-end gap-2 text-white">
                    <span className="text-5xl font-black">{totalCaloriesConsumed}</span>
                    <span className="text-lg font-bold text-emerald-400 mb-1">kcal</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-white/5 p-6 rounded-4xl shadow-xl relative overflow-hidden group">
                   <div className="flex items-center justify-between mb-1">
                     <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Hydration</p>
                     <Droplets className="w-4 h-4 text-cyan-500" />
                   </div>
                   <div className="flex items-end gap-2 text-white">
                     <span className="text-5xl font-black">{dailyWater / 1000}</span>
                     <span className="text-lg font-bold text-cyan-400 mb-1">L</span>
                   </div>
                </div>

                <div className="bg-slate-900 border border-white/5 p-6 rounded-4xl shadow-xl relative overflow-hidden flex flex-col justify-center group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-white font-black text-xl">{goals.length} Goals</p>
                      <p className="text-slate-500 text-xs font-bold uppercase">Active trackers</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mt-6">
                 {/* Main Column */}
                 <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem]">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        Recent Workouts
                      </h3>
                      <div className="space-y-4">
                        {activities.length === 0 ? (
                          <div className="text-center py-12 bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <Activity className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No activities recorded yet.</p>
                          </div>
                        ) : (
                          activities.slice(-4).reverse().map((a, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/8 transition-all">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                  <Activity className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="font-bold text-white">{a.exercise}</p>
                                  <p className="text-xs text-slate-500">{a.duration} mins • {a.intensity}</p>
                                </div>
                              </div>
                              <p className="font-black text-blue-400">-{a.calories}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem]">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-emerald-500" />
                        Recent Meals
                      </h3>
                      <div className="space-y-4">
                        {dietEntries.length === 0 ? (
                          <div className="text-center py-12 bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <Utensils className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No meals recorded yet.</p>
                          </div>
                        ) : (
                          dietEntries.slice(-4).reverse().map((d, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/8 transition-all">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                  <Utensils className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="font-bold text-white">{d.mealName}</p>
                                  <p className="text-xs text-slate-500 capitalize">{d.mealType}</p>
                                </div>
                              </div>
                              <p className="font-black text-emerald-400">+{d.calories}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <WeeklyInsight activities={activities} dietEntries={dietEntries} />
                 </div>

                 {/* Sidebar Column */}
                 <div className="space-y-6">
                    <WaterTracker />
                    <div className="bg-linear-to-br from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <Target className="w-24 h-24" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Daily Tip</h3>
                      <p className="text-indigo-100 font-medium text-sm leading-relaxed mb-6">
                        Drinking water before meals can help with weight loss and improve digestion. Aim for 8 glasses a day!
                      </p>
                      <button 
                        onClick={() => setActiveTab("goals")}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-xl text-sm font-black transition-all"
                      >
                        Set New Goal
                      </button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === "log" && (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ActivityForm onSaved={loadData} />
              <DietForm onSaved={loadData} />
            </div>
          )}

          {activeTab === "goals" && (
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <GoalsTracker goals={goals} onGoalsUpdated={loadData} />
            </div>
          )}

          {activeTab === "profile" && (
            <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Profile />
            </div>
          )}
        </section>
      </main>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-3xl border-t border-white/5 px-6 py-4 flex justify-between items-center lg:hidden z-50">
        {[
          { id: "dashboard", icon: LayoutDashboard, label: "Feed" },
          { id: "log", icon: PlusCircle, label: "Log" },
          { id: "goals", icon: Target, label: "Goals" },
          { id: "profile", icon: User, label: "Me" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === item.id ? "text-blue-500 scale-110" : "text-slate-500"
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>

      {showNotifications && (
        <NotificationPanel 
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          markAsRead={(id) => {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
          }}
        />
      )}
    </div>
  )
}

export default App