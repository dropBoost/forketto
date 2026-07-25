"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ImageIcon,
  Loader2,
  Save,
  Settings,
} from "lucide-react";

import { updateSettingsHoreca } from "../actions/updateSettings";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const initialState = {
  success: false,
  message: "",
};

export default function UpdateSettingsHoreca({
  idHoreca,
  initialSettings = {},
}) {
  const [open, setOpen] = useState(false);

  const [logoPreview, setLogoPreview] = useState(
    initialSettings?.logo ?? ""
  );

  const [coverPreview, setCoverPreview] = useState(
    initialSettings?.cover ?? ""
  );

  async function action(previousState, formData) {
    const result = await updateSettingsHoreca(formData);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result.message);
    }

    return result;
  }

  const [state, formAction, pending] = useActionState(
    action,
    initialState
  );

  useEffect(() => {
    setLogoPreview(initialSettings?.logo ?? "");
    setCoverPreview(initialSettings?.cover ?? "");
  }, [initialSettings]);

  function handleImagePreview(event, setter) {
    const file = event.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setter(previewUrl);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <Settings />
          Personalizza
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Configurazione attività
          </DialogTitle>

          <DialogDescription>
            Personalizza l’aspetto, i contatti e le funzionalità
            della pagina Horeca.
          </DialogDescription>
        </DialogHeader>

        <form
          id="form-settings-horeca"
          action={formAction}
          className="grid max-h-[65vh] gap-6 overflow-y-auto pr-2"
        >
          <input
            type="hidden"
            name="id_horeca"
            value={idHoreca}
          />

          <input
            type="hidden"
            name="logo_attuale"
            value={initialSettings?.logo ?? ""}
          />

          <input
            type="hidden"
            name="cover_attuale"
            value={initialSettings?.cover ?? ""}
          />

          {/* COLORI */}
          <div className="grid gap-4 rounded-xl border p-4">
            <div>
              <h3 className="font-semibold">
                Colori
              </h3>

              <p className="text-sm text-muted-foreground">
                Imposta i colori principali della pagina.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ColorField
                id="colore"
                name="colore"
                label="Colore header"
                defaultValue={
                  initialSettings?.colore ?? "#ffcc05"
                }
              />

              <ColorField
                id="coloreTestoHeader"
                name="coloreTestoHeader"
                label="Colore testo header"
                defaultValue={
                  initialSettings?.coloreTestoHeader ??
                  "#000000"
                }
              />
            </div>
          </div>

          {/* IMMAGINI */}
          <div className="grid gap-5 rounded-xl border p-4">
            <div>
              <h3 className="font-semibold">
                Immagini
              </h3>

              <p className="text-sm text-muted-foreground">
                Carica il logo e l’immagine di copertina.
              </p>
            </div>

            {/* LOGO */}
            <div className="grid gap-2">
              <Label htmlFor="logo">
                Logo
              </Label>

              <Input
                id="logo"
                name="logo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) =>
                  handleImagePreview(
                    event,
                    setLogoPreview
                  )
                }
              />

              {logoPreview ? (
                <div
                  className="size-28 rounded-full border bg-muted"
                  style={{
                    backgroundImage: `url("${logoPreview}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              ) : (
                <div className="flex size-28 items-center justify-center rounded-full border border-dashed bg-muted">
                  <ImageIcon className="size-6 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* COVER */}
            <div className="grid gap-2">
              <Label htmlFor="cover">
                Immagine di copertina
              </Label>

              <Input
                id="cover"
                name="cover"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) =>
                  handleImagePreview(
                    event,
                    setCoverPreview
                  )
                }
              />

              {coverPreview ? (
                <div
                  className="aspect-16/4 w-full rounded-xl border bg-muted"
                  style={{
                    backgroundImage: `url("${coverPreview}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              ) : (
                <div className="flex aspect-16/4 w-full items-center justify-center rounded-xl border border-dashed bg-muted">
                  <ImageIcon className="size-6 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* SOCIAL */}
          <div className="grid gap-4 rounded-xl border p-4">
            <div>
              <h3 className="font-semibold">
                Social
              </h3>

              <p className="text-sm text-muted-foreground">
                Inserisci i link completi dei profili social.
              </p>
            </div>

            <div className="grid gap-4">
              <FormField
                id="instagram"
                name="instagram"
                label="Instagram"
                type="url"
                placeholder="https://instagram.com/nomeprofilo"
                defaultValue={
                  initialSettings?.instagram ?? ""
                }
              />

              <FormField
                id="facebook"
                name="facebook"
                label="Facebook"
                type="url"
                placeholder="https://facebook.com/nomepagina"
                defaultValue={
                  initialSettings?.facebook ?? ""
                }
              />

              <FormField
                id="tiktok"
                name="tiktok"
                label="TikTok"
                type="url"
                placeholder="https://tiktok.com/@nomeprofilo"
                defaultValue={
                  initialSettings?.tiktok ?? ""
                }
              />
            </div>
          </div>

          {/* CONTATTI */}
          <div className="grid gap-4 rounded-xl border p-4">
            <div>
              <h3 className="font-semibold">
                Contatti
              </h3>

              <p className="text-sm text-muted-foreground">
                Inserisci email e numero WhatsApp.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                id="email"
                name="email"
                label="Email"
                type="email"
                placeholder="info@locale.it"
                defaultValue={
                  initialSettings?.email ?? ""
                }
              />

              <FormField
                id="whatsapp"
                name="whatsapp"
                label="WhatsApp"
                type="text"
                placeholder="+39 333 1234567"
                defaultValue={
                  initialSettings?.whatsapp ?? ""
                }
              />
            </div>
          </div>

          {/* FUNZIONALITÀ */}
          <div className="grid gap-3 rounded-xl border p-4">
            <div>
              <h3 className="font-semibold">
                Funzionalità
              </h3>

              <p className="text-sm text-muted-foreground">
                Abilita o disabilita le sezioni disponibili.
              </p>
            </div>

            <SwitchField
              id="maps"
              name="maps"
              label="Mostra mappa"
              description="Mostra la posizione del locale nella pagina."
              defaultChecked={
                initialSettings?.maps ?? false
              }
            />

            <SwitchField
              id="prenotazioni"
              name="prenotazioni"
              label="Abilita prenotazioni"
              description="Mostra la sezione dedicata alle prenotazioni."
              defaultChecked={
                initialSettings?.prenotazioni ?? false
              }
            />
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => setOpen(false)}
          >
            Annulla
          </Button>

          <Button
            type="submit"
            form="form-settings-horeca"
            disabled={pending}
          >
            {pending ? (
              <>
                <Loader2 className="animate-spin" />
                Salvataggio...
              </>
            ) : (
              <>
                <Save />
                Salva modifiche
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  id,
  name,
  label,
  type = "text",
  placeholder,
  defaultValue,
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {label}
      </Label>

      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </div>
  );
}

function ColorField({
  id,
  name,
  label,
  defaultValue,
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {label}
      </Label>

      <div className="flex gap-2">
        <Input
          id={id}
          name={name}
          type="color"
          value={value}
          onChange={(event) =>
            setValue(event.target.value)
          }
          className="h-10 w-14 cursor-pointer p-1"
        />

        <Input
          type="text"
          value={value}
          onChange={(event) =>
            setValue(event.target.value)
          }
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

function SwitchField({
  id,
  name,
  label,
  description,
  defaultChecked,
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
      <div className="space-y-1">
        <Label htmlFor={id}>
          {label}
        </Label>

        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <Switch
        id={id}
        checked={checked}
        onCheckedChange={setChecked}
      />

      <input
        type="hidden"
        name={name}
        value={checked ? "true" : "false"}
      />
    </div>
  );
}