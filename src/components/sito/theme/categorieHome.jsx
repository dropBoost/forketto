import Link from "next/link"

export default function CategorieHomepage ({categorie}) {

  console.log(categorie)

  return (

  <div className="flex flex-row items-center justify-center w-full bg-primary min-h-120">
    <div className="grid grid-cols-4 gap-4 w-full h-full max-w-7xl">
      {categorie.map(c => (
        <Link href={`/categoria/${c?.id}`} key={c.id} className="flex items-center justify-center p-5 rounded-full border-2 border-neutral-100">{c.alias}</Link>
      ))}
    </div>
  </div>

  )
}