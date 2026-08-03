import Image from "next/image"

export default function PAGEsitoHoreca () {
  return (
    <section className="min-h-full w-full flex flex-col items-center">
      <div className="w-full h-200">
        <Image src="/assets/img/account_registrazione_horeca.png" width={1920} height={600} className="object-cover" alt="banner_horeca"/>
      </div>
    </section>
  )
}