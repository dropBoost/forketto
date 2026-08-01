import { ConciergeBell } from "lucide-react"

export default function ElencoNotifiche () {
  
  return (
    <div className="flex flex-row gap-2 items-center justify-center p-2 rounded-lg w-full bg-muted hover:bg-primary">
      <ConciergeBell size={18}/>
      <span className="text-xs font-bold">NOTIFICHE</span>
    </div>
  )
}