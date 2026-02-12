import { Bell, Info, AlertCircle, CheckCircle2, X } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success"
  time: string
  read: boolean
}

interface NotificationsProps {
  onClose: () => void
  notifications: Notification[]
  markAsRead: (id: string) => void
}

export function NotificationPanel({ onClose, notifications, markAsRead }: NotificationsProps) {
  return (
    <div className="fixed inset-0 lg:left-24 bg-slate-950/40 backdrop-blur-md z-[100] flex justify-end">
      <div 
        className="w-full max-w-md bg-slate-900 border-l border-white/5 shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Bell className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Notifications</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-85px)] p-4 space-y-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
              <Bell className="w-12 h-12 text-slate-700" />
              <p className="text-slate-400 font-medium">No new notifications</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  notif.read 
                    ? "bg-slate-800/30 border-white/5 opacity-60" 
                    : "bg-slate-800/80 border-blue-500/20 shadow-lg shadow-blue-500/5 hover:border-blue-500/40"
                }`}
              >
                <div className="flex gap-4">
                  <div className={`mt-1 p-2 rounded-lg shrink-0 ${
                    notif.type === "success" ? "bg-emerald-500/10 text-emerald-400" :
                    notif.type === "warning" ? "bg-amber-500/10 text-amber-400" :
                    "bg-blue-500/10 text-blue-400"
                  }`}>
                    {notif.type === "success" && <CheckCircle2 className="w-4 h-4" />}
                    {notif.type === "warning" && <AlertCircle className="w-4 h-4" />}
                    {notif.type === "info" && <Info className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-white text-sm">{notif.title}</h3>
                      <span className="text-[10px] text-slate-500 font-medium">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="hidden lg:block flex-1" onClick={onClose} />
    </div>
  )
}