import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavAction } from "./nav-action"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu } from "@/components/ui/sidebar"
import navData from "./nav-data/nav-data"
import Image from "next/image"
import Link from "next/link"

export async function AppSidebar({ ...props }) {

  const nav = await navData()

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
        <NavMain items={nav.navMain} />
        <NavSecondary items={nav.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={nav.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
