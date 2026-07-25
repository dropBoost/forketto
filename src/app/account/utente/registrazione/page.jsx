"use client"

import { FormRegistrazioneUtente } from "@/app/account/utente/registrazione/form-registrazione-utente"
import { GalleryVerticalEndIcon } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="grid h-svh lg:grid-cols-2 w-full">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div
              className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            Forketto
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <FormRegistrazioneUtente />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block max-h-svh">
        <img
          src="/assets/img/account_registrazione_horeca.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
      </div>
    </div>
  );
}
