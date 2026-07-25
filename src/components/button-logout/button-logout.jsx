import { logoutUtenteAction } from "./action";
import { Button } from "@/components/ui/button";

export function ButtonLogout({label, variant, size}) {
  return (
    <form action={logoutUtenteAction}>
      <Button type="submit" variant={variant} size={size}>
        {label}
      </Button>
    </form>
  );
}