import Link from "next/link";

export default function BannerPromo ({
  linkCallToAction = "/#",
  callToAction = "Clicca Qui",
  titolo = "Titolo di Default",
  sottotitolo = "Sottotitolo di Default",
  bgImg = "",
  bgColor = "#ffcc05",
  height = 400
}) {



  return (
  <div className="flex flex-col items-center justify-center w-full max-w-7xl bg-primary bg-center bg-cover rounded-4xl" 
    style={{backgroundImage: `url(${bgImg})`, backgroundColor:bgColor, height:height}}
  >
    <div className="flex items-center justify-center flex-col w-full">
      <div className="flex items-center flex-col py-5">
        {titolo !== "" ?  <h2 className="text-5xl font-black bg-primary text-secondary w-fit py-2 px-3">{titolo}</h2> : null }
        {sottotitolo !== "" ? <h3 className="text-xl bg-secondary text-neutral-600 w-fit py-1 px-3">{sottotitolo}</h3> : null }
      </div>
      {linkCallToAction !== "" && callToAction !== "" ? 
      <Link className="bg-primary w-fit rounded-lg p-3 text-secondary font-bold uppercase" href={linkCallToAction}>{callToAction}</Link> : 
      null}
    </div>
  </div>
  )
}