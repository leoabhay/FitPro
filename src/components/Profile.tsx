import { useState, useEffect } from "react"
import { User, Scale, Ruler, Calculator, Save, CheckCircle2 } from "lucide-react"
// import { saveProfile, getProfile } from "../lib/db"

export function Profile() {
  const [weight, setWeight] = useState("")
  const [feet, setFeet] = useState("")
  const [name, setName] = useState("")
  const [bmi, setBmi] = useState<number | null>(null)
  const [status, setStatus] = useState("")
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getProfile() as any
      if (data) {
        setName(data.name || "")
        setWeight(data.weight || "")
        setFeet(data.feet || "")
        calculateBMI(data.weight, data.feet)
      }
    }
    loadProfile()
  }, [])

  const calculateBMI = (w: string, ft: string) => {
    const weightVal = parseFloat(w)
    const feetVal = parseFloat(ft) || 0
    
    // Convert feet to meters (1 foot = 0.3048 meters)
    const heightInMeters = feetVal * 0.3048

    if (weightVal > 0 && heightInMeters > 0) {
      const bmiVal = weightVal / (heightInMeters * heightInMeters)
      setBmi(parseFloat(bmiVal.toFixed(1)))
      
      if (bmiVal < 18.5) setStatus("Underweight")
      else if (bmiVal < 25) setStatus("Normal")
      else if (bmiVal < 30) setStatus("Overweight")
      else setStatus("Obese")
    } else {
      setBmi(null)
      setStatus("")
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await saveProfile({ name, weight, feet })
    calculateBMI(weight, feet)
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 3000)
  }

  const getStatusColor = (s: string) => {
    switch (s) {
      case "Normal": return "text-emerald-400"
      case "Underweight": return "text-amber-400"
      case "Overweight": return "text-orange-400"
      case "Obese": return "text-red-400"
      default: return "text-slate-400"
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Profile Form */}
      <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
        <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
          <User className="w-6 h-6 text-blue-500" />
          User Profile
        </h3>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Weight (kg)</label>
              <div className="relative group">
                <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Height (ft)</label>
              <div className="relative group">
                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="number"
                  step="0.01"
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  placeholder="e.g. 5.9"
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            {showSaved ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Profile
              </>
            )}
          </button>
        </form>
      </div>

      {/* BMI Display */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 p-8 rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full -m-20" />
        
        <Calculator className="w-16 h-16 text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-500" />
        <h3 className="text-xl font-bold text-white mb-2">BMI Calculator</h3>
        
        {bmi ? (
          <div className="space-y-4">
            <div className="relative">
              <span className="text-7xl font-black text-white tracking-tighter">{bmi}</span>
              <div className="absolute -top-2 -right-12 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Score
              </div>
            </div>
            <p className={`text-2xl font-black ${getStatusColor(status)}`}>
              {status}
            </p>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              {status === "Normal" 
                ? "You're in a healthy weight range! Keep maintaining your lifestyle." 
                : "Try to balance your diet and activity to reach a healthier BMI."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-7xl font-black text-white/5 tracking-tighter">--.-</div>
            <p className="text-slate-500 font-medium">Enter your details to calculate BMI</p>
          </div>
        )}

        {/* BMI Scale Marker */}
        <div className="mt-12 w-full max-w-sm h-3 bg-white/5 rounded-full relative overflow-hidden flex border border-white/5">
           <div className="flex-1 bg-amber-400/50" />
           <div className="flex-1 bg-emerald-400/50" />
           <div className="flex-1 bg-orange-400/50" />
           <div className="flex-1 bg-red-400/50" />
           {bmi && (
             <div 
               className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] transition-all duration-1000"
               style={{ 
                 left: `${Math.min(Math.max(((bmi - 15) / 25) * 100, 0), 100)}%` 
               }}
             />
           )}
        </div>
        <div className="flex justify-between w-full max-w-sm mt-2 text-[8px] font-black uppercase tracking-widest text-slate-600">
          <span>Under</span>
          <span>Normal</span>
          <span>Over</span>
          <span>Obese</span>
        </div>
      </div>
    </div>
  )
}
