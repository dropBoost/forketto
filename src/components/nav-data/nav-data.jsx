import { LayoutDashboardIcon, Settings2Icon, CircleHelpIcon } from "lucide-react"

export default function navData () {

  const navData = {
    user: {
      name: "utente.email",
      email: "m@example.com",
      // avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Horeca",
        url: "/manager/horeca",
        icon: (
          <LayoutDashboardIcon />
        ),
      },
      {
        title: "Menu",
        url: "/manager/menu",
        icon: (
          <LayoutDashboardIcon />
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

