import { getMenuCategorie } from "@/lib/menu/getMenuCategorie";

export default async function PageMENU() {

  const categorie = await getMenuCategorie();

  return (
  <div className="@container/main flex flex-1 flex-col p-4">
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-2">
        {categorie.map((categoria) => (
        <div key={categoria.id}>
          {categoria.alias} - {categoria?.supercategoria?.alias}
        </div>
      ))}
      </div>
    </div>
  </div>
  );
}
