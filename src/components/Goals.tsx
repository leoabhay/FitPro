import React, { useState } from "react"
import { saveGoal, updateGoal, deleteGoal } from "../lib/db"
import { Target, Plus, Trash2, CheckCircle2 } from "lucide-react"

export function GoalsTracker({ goals, onGoalsUpdated }: { goals: any[]; onGoalsUpdated: () => void }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    goalType: "weight",
    goalName: "",
    targetValue: "",
    currentValue: "",
    unit: "kg",
    deadline: "",
  })

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await saveGoal({
        ...formData,
        targetValue: parseFloat(formData.targetValue),
        currentValue: parseFloat(formData.currentValue),
        createdAt: Date.now(),
        status: "active",
      })
      setFormData({ goalType: "weight", goalName: "", targetValue: "", currentValue: "", unit: "kg", deadline: "" })
      setShowForm(false)
      onGoalsUpdated()
    } catch (error) {
      console.error("Error saving goal:", error)
    }
  }

  const handleUpdateProgress = async (goalId: number, newValue: string) => {
    const goal = goals.find((g) => g.id === goalId)
    if (goal) {
      try {
        await updateGoal(goalId, { ...goal, currentValue: parseFloat(newValue) })
        onGoalsUpdated()
      } catch (error) {
        console.error("Error updating goal:", error)
      }
    }
  }

  const handleDeleteGoal = async (goalId: number) => {
    try {
      await deleteGoal(goalId)
      onGoalsUpdated()
    } catch (error) {
      console.error("Error deleting goal:", error)
    }
  }

  const calculateProgress = (goal: any) => {
    const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100)
    return isNaN(progress) ? 0 : Math.max(progress, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-400" /> My Goals
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 bg-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-all"
        >
          {showForm ? "Cancel" : <Plus className="w-6 h-6" />}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddGoal} className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Goal Name</label>
            <input
              type="text"
              value={formData.goalName}
              onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
              className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              required
              placeholder="e.g. Run 100km"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Current</label>
              <input
                type="number"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Target</label>
              <input
                type="number"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-2xl transition-all">
            Create Goal
          </button>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {goals.map((goal) => {
          const progress = calculateProgress(goal)
          return (
            <div key={goal.id} className="bg-slate-900/50 backdrop-blur-xl p-5 rounded-3xl border border-white/10 group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{goal.goalName}</h3>
                  <p className="text-sm text-slate-400">{goal.currentValue} / {goal.targetValue} {goal.unit}</p>
                </div>
                <button onClick={() => handleDeleteGoal(goal.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-purple-400">{progress.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <input
                  type="number"
                  defaultValue={goal.currentValue}
                  onBlur={(e) => handleUpdateProgress(goal.id, e.target.value)}
                  className="flex-1 bg-slate-800/50 border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none"
                />
                {progress >= 100 && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
