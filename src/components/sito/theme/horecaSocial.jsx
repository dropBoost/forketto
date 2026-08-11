import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare, faInstagramSquare, faTiktok } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

export default function HorecaSocialLink ({instagram, facebook, tiktok}) {

  if ( !instagram && !facebook && !tiktok) return null

  return (
    <div id="social_link" className="flex flex-row">
      {facebook && 
      <Link href={facebook} target="_blank">
        <FontAwesomeIcon icon={faFacebookSquare} className="text-primary lg:text-xl text-lg"/>
      </Link>
      }
      {instagram && 
      <Link href={instagram} target="_blank">
        <FontAwesomeIcon icon={faInstagramSquare} className="text-primary lg:text-xl text-lg"/>
      </Link>
      }
      {tiktok &&
      <Link href={tiktok} target="_blank">
        <FontAwesomeIcon icon={faTiktok} className="text-primary lg:text-xl text-lg"/>
      </Link>
      }
    </div>
  )
}