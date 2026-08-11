import Link from "next/link"
import Image from "next/image"
import CategorieHomeDrawer from "./categorieHomeDrawer"

export default function CategorieHomepage ({categorie, supercategorie}) {
  console.log(supercategorie)
  return (

  <div className="flex flex-row items-center justify-center w-full bg-primary min-h-120">
    <div className="grid grid-cols-4 gap-4 w-full h-full max-w-7xl">
      {supercategorie.filter(s => s.vetrina == true).map(s => (
        <CategorieHomeDrawer key={s.id} categorie={categorie.filter(c => c.id_supercategoria == s.id)} supercategorie={s}/>
      ))}
    </div>
  </div>

  )
}


        {/* <Link href={`/categoria/${c?.id}`} key={c.id} className="flex flex-col aspect-square items-center justify-center p-5 rounded-full border-2 border-neutral-100">
          <Image src={`/assets/img/placeholder.png`} width={200} height={200} alt={`forketto ${c.alias}`} className=""/>
          <span>{c.alias}</span>
        </Link> */}