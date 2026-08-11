"use client"

import * as React from "react"
import { toast } from "sonner"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"

export default function CategorieHomeDrawer({categorie, supercategorie}) {

  const [open, setOpen] = React.useState(false)
  const [deliveryTime, setDeliveryTime] = React.useState("asap")
  const isMobile = useIsMobile()

  function handleConfirm() {
    const selected = deliveryTimes.find((time) => time.value === deliveryTime)

    if (!selected) {
      return
    }

    setOpen(false)
    toast("Delivery time confirmed", {
      description: selected.label,
    })
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} showSwipeHandle={isMobile} direction="right">
      <DrawerTrigger className="flex flex-col gap-5 items-center justify-center rounded-4xl p-5! border border-white/30 h-fit aspect-square hover:bg-white/30 transition-all">
        <Image src="/assets/img/placeholder.png" width={150} height={150} alt={`Forketto ${supercategorie.alias}`} className="rounded-full aspect-square object-cover object-center w-[70%]"/>
        <h3 className="uppercase text-neutral-50 font-bold border border-white/30 px-5 py-2 rounded-2xl">{supercategorie.alias}</h3> 
      </DrawerTrigger>
      <DrawerContent className="w-[90vw] sm:max-w-6xl!">
        <DrawerHeader className={`bg-primary rounded-tl-xl`}>
          <DrawerTitle className={`text-4xl font-bold text-secondary`}>{supercategorie.alias}</DrawerTitle>
          {/* <DrawerDescription>
            We&apos;ll prepare your order as soon as possible.
          </DrawerDescription> */}
        </DrawerHeader>
        <div className="flex flex-1 flex-col gap-2 p-4 overflow-y-auto scroll-m-4">
          {categorie?.map((categoria) => (
            <div key={categoria.id} className="flex flex-row gap-1">
            <Link href={`/categoria/${categoria.id}`} className={`items-center justify-start bg-secondary text-neutral-700 text-2xl hover:text-primary px-3 py-2 transition-all`}>
              {categoria.alias}
            </Link>
            </div>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose>Chiudi</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
