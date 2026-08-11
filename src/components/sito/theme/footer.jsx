import Image from "next/image";
import SocialLink from "./socialLink";
import Link from "next/link";
import CategorieFooter from "./categorieFooter";

export default function Footer ({categorie}) {
  return (

  <footer className="flex flex-col justify-end items-center w-full min-h-70 bg-secondary xl:px-0 px-4">
    <div className="flex flex-col w-full py-5 bg-neutral-50 rounded-b-3xl max-w-7xl">
      <CategorieFooter categorie={categorie}/>
    </div>
    <div className="flex flex-1 flex-row justify-between items-end w-full py-5 px-10 max-w-7xl">
      <div id="logo">
        <Image src={`/assets/img/logo_forketto.png`} className="flex flex-row items-center justify-between max-w-50 bg-primary px-1 py-2" width={400} height={250} quality={100} loading="eager" alt="logo forketto"/>
      </div>
      <SocialLink/>
    </div>
    <div className="flex flex-row justify-center items-center w-full bg-neutral-200 p-2">
      <Link href={`https://www.dropboost.it`} target="_blank" className="text-[0.6rem]">powered by 💜 dropboost.it</Link>
    </div>
  </footer>

  )
}