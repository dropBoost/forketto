import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { redirect } from "next/navigation"
import { requireSubscription } from "@/lib/auth/requireSubscription"
import BreadcrumbManager from "@/components/breadcrumb/breadcrumb-manager"
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function MANAGERLayout({ children }) {

  // const utente = await getUtenteLoggato()
  const { authUser, utente, abbonamento, piano } = await requireSubscription()
  
  if (!utente) {
    redirect(`/`)
  }

  if (utente?.utente?.ruolo == "CLT") {
    redirect(`/`)
  }
  
  return (
    <body className="min-h-full w-full flex flex-col items-center">
      <TooltipProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange >
          <SidebarProvider style={{"--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)"}}>
            <AppSidebar variant="inset" utente={utente}/>
            <SidebarInset>
              <BreadcrumbManager/>
              { children }
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </TooltipProvider>
    </body>
  );

}
