"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { CommandIcon } from "lucide-react"
import { Separator } from "./ui/separator"
import navData from "./nav-data/nav-data"

export function AppSidebar({ ...props }) {

  const nav = navData()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="/manager">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Forketto</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator/>
      <SidebarContent>
        <NavMain items={nav.navMain} />
        <NavSecondary items={nav.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={nav.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
