import { Badge } from "@/components/ui/badge";

const statusConfig = {
  active: {
    label: "Attivo",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  },

  trialing: {
    label: "Periodo di prova",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  },

  past_due: {
    label: "Pagamento in ritardo",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  },

  canceled: {
    label: "Annullato",
    className:
      "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300",
  },

  unpaid: {
    label: "Non pagato",
    className:
      "border-red-200 bg-red-50 text-primary dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  },

  incomplete: {
    label: "Incompleto",
    className:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300",
  },

  incomplete_expired: {
    label: "Scaduto",
    className:
      "border-red-200 bg-red-50 text-primary dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  },

  paused: {
    label: "In pausa",
    className:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-300",
  },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] ?? {
    label: status || "Sconosciuto",
    className: "",
  };

  return (
    <Badge
      variant="outline"
      className={config.className}
    >
      <span className="mr-1.5 size-2 rounded-full bg-current" />
      {config.label}
    </Badge>
  );
}