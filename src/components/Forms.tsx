import React, { useState } from "react"
import { saveActivity, saveDietEntry } from "../lib/db"
import { Activity, Utensils, Zap, Clock, Flame, ChevronRight } from "lucide-react"

export function ActivityForm({ onSaved }: { onSaved: () => void }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    exercise: "",
    duration: "",
    calories: "",
    intensity: "moderate",
    notes: "",
  })

  const exercises = ["Running", "Walking", "Cycling", "Swimming", "Yoga", "Weightlifting", "HIIT", "Pilates"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await saveActivity({
        date: new Date().toISOString().split("T")[0],
        exercise: formData.exercise,
        duration: parseInt(formData.duration) || 0,
        calories: parseInt(formData.calories) || 0,
        intensity: formData.intensity,
        notes: formData.notes,
        timestamp: Date.now(),
      })
      setFormData({ exercise: "", duration: "", calories: "", intensity: "moderate", notes: "" })
      onSaved()
    } catch (error) {
      console.error("Error saving activity:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500/20 rounded-2xl">
          <Activity className="w-6 h-6 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Log Exercise</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Exercise Type</label>
          <select
            value={formData.exercise}
            onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          >
            <option value="">Select an exercise...</option>
            {exercises.map((ex) => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Duration (min)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Flame className="w-4 h-4" /> Calories
            </label>
            <input
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Intensity
          </label>
          <div className="flex gap-2">
            {["low", "moderate", "high"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFormData({ ...formData, intensity: level })}
                className={`flex-1 py-2 px-3 rounded-xl font-medium transition-all ${
                  formData.intensity === level
                    ? "bg-blue-500 text-white"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : "Log Exercise"}
          <ChevronRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}

export function DietForm({ onSaved }: { onSaved: () => void }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    mealType: "breakfast",
    mealName: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await saveDietEntry({
        date: new Date().toISOString().split("T")[0],
        mealType: formData.mealType,
        mealName: formData.mealName,
        calories: parseInt(formData.calories) || 0,
        protein: parseInt(formData.protein) || 0,
        carbs: parseInt(formData.carbs) || 0,
        fat: parseInt(formData.fat) || 0,
        notes: formData.notes,
        timestamp: Date.now(),
      })
      setFormData({ mealType: "breakfast", mealName: "", calories: "", protein: "", carbs: "", fat: "", notes: "" })
      onSaved()
    } catch (error) {
      console.error("Error saving diet entry:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-500/20 rounded-2xl">
          <Utensils className="w-6 h-6 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Log Meal</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Meal Type</label>
            <select
              value={formData.mealType}
              onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
              className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Calories</label>
            <input
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Meal Name</label>
          <input
            type="text"
            value={formData.mealName}
            onChange={(e) => setFormData({ ...formData, mealName: e.target.value })}
            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            required
            placeholder="e.g. Avocado Toast"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400">Protein (g)</label>
            <input
              type="number"
              value={formData.protein}
              onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
              className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400">Carbs (g)</label>
            <input
              type="number"
              value={formData.carbs}
              onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
              className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400">Fat (g)</label>
            <input
              type="number"
              value={formData.fat}
              onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
              className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
        >
          {loading ? "Saving..." : "Log Meal"}
          <ChevronRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}
