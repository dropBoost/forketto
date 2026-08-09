"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleDashedIcon,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task.",
  },
  {
    title: "Scroll Area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information when an element receives focus or hover.",
  },
];

export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center w-full ">
      {/* <div className="py-2">TOP BAR</div> */}
      <div className="flex flex-col items-center justify-center w-full bg-primary">
        <div className="flex h-16 w-full items-center justify-between gap-2 px-4 max-w-7xl">
          <Link href={`/`} className="flex h-full w-50 items-center justify-start">
            <Image
              src="/assets/img/logo_forketto.png"
              width={200}
              height={100}
              alt="Forketto logo"
              className="h-auto w-40 dark:invert"
              priority
            />
          </Link>

          <div className="flex h-full flex-1 items-center justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/horeca" target="_blank" className={`px-3 py-1 text-background hover:text-foreground`} >
                    FOOD
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {/* <NavigationMenuItem className="hidden md:flex">
                  <NavigationMenuTrigger className="bg-transparent text-neutral-100 hover:bg-white/10 hover:text-neutral-100 data-[state=open]:bg-white/10 data-[state=open]:text-neutral-100">
                    Components
                  </NavigationMenuTrigger>

                  <NavigationMenuContent className="bg-neutral-900 text-neutral-100">
                    <ul className="grid w-100 gap-2 p-2 md:w-125 md:grid-cols-2 lg:w-150">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem> */}

                {/* <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-neutral-100 hover:bg-white/10 hover:text-neutral-100 data-[state=open]:bg-white/10 data-[state=open]:text-neutral-100">
                    With Icon
                  </NavigationMenuTrigger>

                  <NavigationMenuContent className="bg-neutral-900 text-neutral-100">
                    <ul className="grid w-50 gap-1 p-2">
                      <li className="flex flex-col gap-1">
                        <IconMenuItem
                          href="#"
                          icon={<CircleAlertIcon className="size-4" />}
                        >
                          Backlog
                        </IconMenuItem>

                        <IconMenuItem
                          href="#"
                          icon={<CircleDashedIcon className="size-4" />}
                        >
                          To Do
                        </IconMenuItem>

                        <IconMenuItem
                          href="#"
                          icon={<CircleCheckIcon className="size-4" />}
                        >
                          Done
                        </IconMenuItem>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem> */}

                {/* <NavigationMenuItem>
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} bg-transparent text-neutral-100 hover:bg-white/10 hover:text-neutral-100`}
                    render={<Link href="/docs">Docs</Link>}
                  />
                </NavigationMenuItem> */}

              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex h-full w-50 items-center justify-end text-neutral-100">
            social
          </div>
        </div>
      </div>
    </header>
  );
}

function ListItem({ title, children, href, ...props }) {
  return (
    <li {...props}>
      <NavigationMenuLink
        className="block rounded-md p-3 text-neutral-100 transition-colors hover:bg-white/10 hover:text-neutral-100 focus:bg-white/10 focus:text-neutral-100"
        render={<Link href={href} />}
      >
        <div className="flex flex-col gap-1 text-sm">
          <span className="font-medium leading-none text-inherit">
            {title}
          </span>

          <p className="line-clamp-2 text-neutral-400">
            {children}
          </p>
        </div>
      </NavigationMenuLink>
    </li>
  );
}

function IconMenuItem({ href, icon, children }) {
  return (
    <NavigationMenuLink
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-100 transition-colors hover:bg-white/10 hover:text-neutral-100 focus:bg-white/10 focus:text-neutral-100"
      render={<Link href={href} />}
    >
      {icon}
      <span>{children}</span>
    </NavigationMenuLink>
  );
}

function NavMenuItem({ label }) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="bg-transparent text-neutral-100 hover:bg-white/10 hover:text-neutral-100 data-[state=open]:bg-white/10 data-[state=open]:text-neutral-100">
        {label}
      </NavigationMenuTrigger>

      <NavigationMenuContent className="bg-red-700 text-neutral-100">
        <ul className="w-96 p-2">
          <ListItem href="/docs/installation" title="Installation">
            How to install dependencies and structure your app.
          </ListItem>

          <ListItem href="/docs/primitives/typography" title="Typography">
            Styles for headings, paragraphs, lists and other elements.
          </ListItem>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}