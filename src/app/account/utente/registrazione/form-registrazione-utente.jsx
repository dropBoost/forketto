import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { registraUtente } from "./action/auth"

export function FormRegistrazioneUtente({ className, ...props }) {  
  
  return (
    <form
      action={registraUtente}
      className={cn("flex flex-col gap-6", className)} {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Crea il tuo account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Compila il form per compilare il tuo account
          </p>
        </div>
        <FieldGroup className={`flex flex-row`}>
          <Field>
            <FieldLabel htmlFor="nome">Nome</FieldLabel>
            <Input
              id="nome"
              name="nome"
              type="text"
              placeholder=""
              required
              className="bg-background" />
          </Field>
          <Field>
            <FieldLabel htmlFor="cognome">Cognome</FieldLabel>
            <Input
              id="cognome"
              name="cognome"
              type="text"
              placeholder=""
              required
              className="bg-background" />
          </Field>
        </FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@esempio.it"
            required
            className="bg-background" />
        </Field>
        <Field>
          <FieldLabel htmlFor="telefono">Telefono</FieldLabel>
          <Input
            id="telefono"
            name="telefono"
            type="number"
            placeholder="333 33 33 333"
            required
            className="bg-background italic" />
          <FieldDescription>
           scrivi il tuo recapito telefonico SENZA prefisso (+39)
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="p_iva">Data di Nascita</FieldLabel>
          <Input
            id="data_nascita"
            name="data_nascita"
            type="date"
            placeholder="10/09/1991"
            required
            className="bg-background italic" />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input 
            id="password"
            name="password"
            type="password"
            required
            className="bg-background" />
          <FieldDescription>
            Deve essere lunga almeno 8 caratteri
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm_password">Conferma Password</FieldLabel>
          <Input 
            id="confirm_password"
            name="confirm_password"
            type="password"
            required
            className="bg-background" />
          <FieldDescription>Conferma la tua password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit">Crea il tuo account</Button>
        </Field>
        <FieldSeparator>
        <Field>
          <FieldDescription className="px-6 text-center">
            Hai già un account <a href="#">Accedi</a>
          </FieldDescription>
        </Field>
        </FieldSeparator>
      </FieldGroup>
    </form>
  );

}
