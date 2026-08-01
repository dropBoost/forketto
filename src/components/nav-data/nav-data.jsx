import { Settings2Icon, CircleHelpIcon, Store, Soup, ChartSpline, Calculator, HandPlatter } from "lucide-react"
import FormMenuSelectHoreca from "@/app/manager/menu/components/FormMenuSelectHoreca"
import ElencoNotifiche from "../notifiche/elencoNotifiche";
import { getUtente } from "@/lib/auth/getUtente"
import { getMenuCategorie } from "@/lib/menu/getMenuCategorie";

export default async function navData () {

  const utente = await getUtente();
  const categorie = await getMenuCategorie();

  const horeca = utente?.horeca
  const avatar = `${utente?.nome?.slice(0,1)}${utente?.cognome?.slice(0,1)}`

  const navData = {

    user: {
      name: `${utente.nome} ${utente.cognome}`,
      email: `${utente.email}`,
      monogram: `${avatar}`,
      logo: `${utente?.img}`
    },

    quickMenu: [
      {
        title: "",
        action: <ElencoNotifiche />
      },
      {
        title: "+ Aggiungi",
        action: <FormMenuSelectHoreca horeca={horeca} categorie={categorie}/>
      }
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "/manager",
        icon: (
          <ChartSpline />
        ),
      },
      {
        title: "Horeca",
        url: "/manager/horeca",
        icon: (
          <Store />
        ),
      },
      {
        title: "Menu",
        url: "/manager/menu",
        icon: (
          <Soup />
        ),
      },
      {
        title: "Food Cost Calc",
        url: "/manager/food-cost-calculator",
        icon: (
          <Calculator />
        ),
      },
      {
        title: "Servizio",
        url: "/manager/sala",
        icon: (
          <HandPlatter />
        ),
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/manager/settings",
        icon: (
          <Settings2Icon />
        ),
      },
      {
        title: "Aiuto",
        url: "#",
        icon: (
          <CircleHelpIcon />
        ),
      },
    ],
  }

  return (
    navData
  )
}

