import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { getUtenteLoggato } from "@/utils/auth/getUtenteLoggato"
import { redirect } from "next/navigation"
import { requireSubscription } from "@/lib/auth/requireSubscription"
import BreadcrumbManager from "@/components/breadcrumb/breadcrumb-manager"

export default async function MANAGERLayout({ children }) {

  // const utente = await getUtenteLoggato()
  const { authUser, utente, abbonamento, piano } = await requireSubscription()
  
  // if (!utente) {
  //   redirect(`/`)
  // }

  // if (utente?.utente?.ruolo == "CLT") {
  //   redirect(`/`)
  // }
  
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange >
    <SidebarProvider style={{"--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)"}}>
      <AppSidebar variant="inset" utente={utente}/>
      <SidebarInset>
        <BreadcrumbManager/>
        { children }
      </SidebarInset>
    </SidebarProvider>
    </ThemeProvider>
  );

}
