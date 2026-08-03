import Image from "next/image";

export default function BannerHomepage () {
  return (
  <div className="flex flex-row items-center justify-center w-full h-150 bg-primary">
    <Image src={`/assets/img/banner_forketto_home.png`} width={1920} height={450} quality={100} alt="banner forketto homepage" className="h-full object-cover" loading="lazy"/>
  </div>
  )
}