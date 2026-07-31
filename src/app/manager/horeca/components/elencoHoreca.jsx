import { Separator } from "@/components/ui/separator"
import { Store } from "lucide-react"
import Link from "next/link"
import FormHoreca from "./formAggiungiHoreca"

export default function ElencoHoreca ({horeca}) {

  return (
    <div className="flex flex-col flex-1 gap-3">
    <div className="flex flex-row items-center justify-center">
      <FormHoreca padding="p-0"/>
    </div>
    <div className="flex flex-col gap-3">
      {horeca?.map(h => (
        <div key={h.id} className="flex flex-col border p-5 rounded-lg gap-3 hover:bg-muted transition-all">
          <div className="flex flex-col w-fit gap-1">
            <div className="flex flex-row items-center gap-1">
              <span className="text-primary"><Store/></span>
              <span className="text-sm">{h.nome}</span>
            </div>
            <Separator/>
            <span className="items-center text-xs text-neutral-500">@{h.alias}</span>
            <span className="text-xs text-neutral-500">{h?.indirizzo}, {h?.civico} - {h?.cap} {h?.citta} {h?.provincia}</span>
          </div>
          <Separator/>
          <div>
            <Link className="text-xs bg-primary px-3 py-1 uppercase" href={`/manager/horeca/settings/${h.id}`}>
              Gestisci
            </Link>
          </div>
        </div>
      ))}
    </div>
    </div>
  )
}