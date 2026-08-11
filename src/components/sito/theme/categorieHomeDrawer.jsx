"use client"

import * as React from "react"
import { toast } from "sonner"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"

const deliveryTimes = [
  {
    value: "asap",
    id: "delivery-asap",
    label: "Standard delivery",
    description: "25–35 min · Driver assigned now",
    badge: "Fastest",
  },
  {
    value: "5-00",
    id: "delivery-5-00",
    label: "5:00 PM – 5:15 PM",
    description: "Prep starts at 4:45 PM",
  },
  {
    value: "5-30",
    id: "delivery-5-30",
    label: "5:30 PM – 5:45 PM",
    description: "Good if you're heading home",
  },
  {
    value: "6-00",
    id: "delivery-6-00",
    label: "6:00 PM – 6:15 PM",
    description: "Most popular · High demand",
  },
  {
    value: "6-30",
    id: "delivery-6-30",
    label: "6:30 PM – 6:45 PM",
    description: "Last slot before kitchen closes",
  },
]

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
      <DrawerTrigger className="inline-flex items-center justify-center rounded-md px-4 py-2"> {supercategorie.alias} </DrawerTrigger>
      <DrawerContent className="w-[90vw] sm:max-w-6xl!">
        <DrawerHeader>
          <DrawerTitle>{supercategorie.alias}</DrawerTitle>
          {/* <DrawerDescription>
            We&apos;ll prepare your order as soon as possible.
          </DrawerDescription> */}
        </DrawerHeader>
        <div className="flex-1 scroll-fade overflow-y-auto p-4">
          {categorie?.map((categoria) => (
            <Button
              key={categoria.id}
              variant="outline"
            >
              {categoria.alias}
            </Button>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose>Chiudi</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
