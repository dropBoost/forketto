import Image from "next/image";
import SocialLink from "./socialLink";

export default function HeaderHome () {
  return (

  <div className="flex flex-row justify-between items-center w-full bg-secondary border py-5 px-10">
    <div id="logo">
      <Image src={`/assets/img/logo_forketto.png`} className="flex flex-row items-center justify-between max-w-50 bg-primary px-1 py-2" width={400} height={250} quality={100} loading="eager" alt="logo forketto"/>
    </div>
    <SocialLink/>
  </div>

  )
}



