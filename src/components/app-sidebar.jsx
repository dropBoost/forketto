"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavAction } from "./nav-action"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { CommandIcon } from "lucide-react"
import { Separator } from "./ui/separator"
import navData from "./nav-data/nav-data"
import Image from "next/image"
import Link from "next/link"

export function AppSidebar({ ...props }) {

  const nav = navData()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <Link href="/manager" className="flex hover:bg-muted bg-red-700 py-1 px-3 transition-all rounded-md items-center justify-center">
            <Image src={`/assets/img/logo_forketto.png`} width={120} height={70} quality={100} alt="logo forketto menu"/>
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
