import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare, faInstagramSquare, faTiktok } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

export default function SocialLink () {
  return (
    <div id="social_link" className="flex flex-row gap-2">
      <Link href={`https://www.facebook.com`} target="_blank">
        <FontAwesomeIcon icon={faFacebookSquare} className="text-primary text-xl"/>
      </Link>
      <Link href={`https://www.instagram.com`} target="_blank">
        <FontAwesomeIcon icon={faInstagramSquare} className="text-primary text-xl"/>
      </Link>
      <Link href={`https://www.tiktok.com`} target="_blank">
        <FontAwesomeIcon icon={faTiktok} className="text-primary text-xl"/>
      </Link>
    </div>
  )
}