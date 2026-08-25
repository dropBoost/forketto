import Link from "next/link"
import Image from "next/image"
import CategorieHomeDrawer from "./categorieHomeDrawer"
import CategorieListDrawer from "./categorieListDrawer"

export default function CategorieHomepage ({categorie, supercategorie}) {

  const supercategorieVetrina = supercategorie.filter(a => a.vetrina == true)
  const cols = supercategorieVetrina.length >= 3 ? supercategorieVetrina.length : 3

  return (

  <div className="flex flex-col gap-4 items-center justify-center w-full bg-primary xl:py-15 xl:px-0 p-10">
    <div className="flex items-center w-full max-w-7xl ">
      <span className="bg-secondary px-2 py-1 text-sm">Categorie in evidenza</span>
    </div>
    <div className={`grid gap-5  w-full h-full max-w-7xl grid-cols-2 lg:grid-cols-(--cols)`} style={{"--cols": `repeat(${cols}, minmax(0, 1fr))`}}>
      {supercategorieVetrina.map(s => (
        <CategorieHomeDrawer key={s.id} categorie={categorie.filter(c => c.id_supercategoria == s.id)} supercategorie={s}/>
      ))}
    </div>
    <div className="flex w-full max-w-7xl items-center justify-end">
      <CategorieListDrawer categorie={categorie} supercategorie={supercategorie} titleTrigger={"vedi tutto"}/>
    </div>
  </div>

  )
}