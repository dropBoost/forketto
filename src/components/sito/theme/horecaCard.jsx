import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function HorecaCard ({h, settings, indirizzo}) {

  return (
    <Link key={h.id} className={`w-full`} href={`/horeca/${h.alias}`}>
      <Card className={`p-0 pt-5`}>
        <CardHeader className={`flex flex-col gap-0`}>
          <h4 className="text-lg font-bold text-neutral-700">{h.nome}</h4>
          <p className="italic">@{h.alias}</p>
        </CardHeader>
        <div className={`w-full border`}>
          <Image className="min-w-full object-cover h-40" src={settings?.settings?.cover} width={150} height={150} quality={70} alt={`${h.alias} _ forketto`}/>
        </div>
        <CardContent className={`flex flex-col items-center`}>
          <Image className="rounded-full h-20 w-20" src={settings?.settings?.logo} width={150} height={150} quality={70} alt={`${h.alias} _ forketto`}/>
        </CardContent>
        <CardFooter className={`bg-primary p-2`}>
          <span className="text-neutral-200">{indirizzo}</span>
        </CardFooter>
      </Card>
    </Link>
  )

}