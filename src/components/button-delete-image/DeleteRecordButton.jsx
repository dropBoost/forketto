// components/DeleteRecordButton/DeleteRecordButton.jsx

"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteRecord } from "./deleteRecord";

export default function DeleteRecordButton({
  table,
  id,
  idField = "id",
  bucket,
  imageField,
  icon = <Trash2 className="size-3" />,
  title = "Elimina elemento",
  description = "Questa operazione è definitiva e non può essere annullata.",
  buttonLabel,
  variant = "destructive",
  className = "",
  disabled = false,
  revalidate,
  setUpdate,
  onSuccess,
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const risultato = await deleteRecord({
        table,
        id,
        idField,
        bucket,
        imageField,
        revalidate,
      });

      if (!risultato.success) {
        toast.error(
          risultato.message ||
            "Impossibile eliminare l'elemento"
        );

        return;
      }

      if (!risultato.imageDeleted) {
        toast.warning(risultato.message);
      } else {
        toast.success(risultato.message);
      }

      setOpen(false);
      onSuccess?.(risultato.id, risultato);
      setUpdate(prev => prev+1)
    });
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!isPending) {
          setOpen(value);
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <Button type="button" variant={variant} disabled={disabled || isPending} className={`h-fit p-1 ${className}`} aria-label={title}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            icon
          )}

          {buttonLabel && (
            <span>{buttonLabel}</span>
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <TriangleAlert className="size-5" />
          </div>

          <AlertDialogTitle>
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Annulla
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Eliminazione...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Elimina definitivamente
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}