import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavAction } from "./nav-action"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import navData from "./nav-data/nav-data"
import Image from "next/image"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export async function AppSidebar({ ...props }) {

  const nav = await navData()
  const utente = props?.utente
  
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <Link href="/manager" className="flex flex-col gap-1 hover:bg-muted py-2 px-3 transition-all rounded-md items-center justify-center">
            <Image src={`/assets/img/logo_forketto.png`} width={800} height={400} quality={100} className="max-w-44 h-auto border border-primary px-4 py-1 rounded-lg" alt="logo forketto menu"/>
            <span className="text-xs font-thin">the best menu ever</span>
          </Link>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavAction items={nav.quickMenu} />
        <div>
          <NavMain items={nav.navMain} />
          {utente.ruolo == "SAM" ?
          <>
          <div className="flex flex-row items-center gap-1 max-w-full px-4">
            <Separator className={`flex-1`}/>
            <ShieldCheck size={18} className="text-primary"/>
            <Separator className={`flex-1`}/>
          </div>
          <NavSecondary items={nav.navSuperadmin} className="mt-auto" />
          </> 
          : null }
        </div>
        <NavSecondary items={nav.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={nav.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
