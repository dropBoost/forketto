import { Settings2Icon, CircleHelpIcon, Store, Soup, ChartSpline, Calculator, HandPlatter } from "lucide-react"
import FormMenu from "@/app/manager/menu/components/FormMenu"

export default function navData () {

  const navData = {
    user: {
      name: "utente.email",
      email: "m@example.com",
      // avatar: "/avatars/shadcn.jpg",
    },
    quickMenu: [
      {
        title: "+ Aggiungi",
        action: <FormMenu />
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

