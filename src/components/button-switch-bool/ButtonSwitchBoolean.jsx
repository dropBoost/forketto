"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { switchBoolean } from "./swtichBoolean";

export default function ButtonSwitchBoolean({
  table,
  id,
  field,
  iconTrue = <Check className="size-4" />,
  iconFalse = <X className="size-4" />,
  value = false,
  idField = "id",
  onSuccess,
  disabled = false,
  colorButton = ""
}) {
  const [checked, setChecked] = useState(Boolean(value));
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setChecked(Boolean(value));
  }, [value]);

  function handleClick() {
    startTransition(async () => {
      const risultato = await switchBoolean({
        table,
        id,
        field,
        value: checked,
        idField,
      });

      if (!risultato.success) {
        toast.error(
          risultato.message ||
            "Impossibile aggiornare il valore"
        );

        return;
      }

      setChecked(risultato.value);

      toast.success(
        risultato.value
          ? "Elemento attivato"
          : "Elemento disattivato"
      );

      onSuccess?.(risultato.value, risultato.data);
    });
  }

  return (
    <Button
  type="button"
  variant={checked ? "default" : "secondary"}
  className={`h-fit p-1 ${
    checked ? colorButton : ""
  }`}
  disabled={disabled || isPending}
  onClick={handleClick}
>
      {isPending ? (
        <Loader2 size={20} className="animate-spin" />
      ) : checked ? (
        iconTrue
      ) : (
        iconFalse
      )}
    </Button>
  );
}