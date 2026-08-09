import Link from "next/link"

export default function CategorieFooter ({categorie}) {

  return (
  <div className="flex flex-col gap-3 items-start px-10 py-2">
    <span className="uppercase w-fit px-3 py-1 text-secondary bg-neutral-400 font-black rounded-lg text-xs">Categorie</span>
    <div className="flex flex-wrap items-center justify-start gap-2">
      {categorie.map(c => (
        <Link href={`/categoria/${c?.id}`} key={c.id}
        className="text-sm capitalize border border-neutral-200 w-fit px-2 py-[0.1rem] rounded-lg hover:bg-primary hover:text-secondary hover:border-neutral-50 transition-all">
          {c.alias}
        </Link>
      ))}
    </div>
  </div>

  )
}