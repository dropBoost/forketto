import BannerHomepage from "@/components/sito/theme/bannerHome";
import CategorieHomepage from "@/components/sito/theme/categorieHome";
import HeaderHome from "@/components/sito/theme/headerHome";

export const metadata = {
  title: "Forketto",
  description: "Scopri Forketto e crea il sito digitale del tuo locale.",
  openGraph: {
    title: "Forketto",
    description: "La piattaforma digitale per il tuo locale.",
    images: [
      {
        url: "/assets/img/logo_forketto.png",
        width: 1200,
        height: 630,
        alt: "Forketto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forketto",
    description: "La piattaforma digitale per il tuo locale.",
    images: ["/assets/img/logo_forketto.png"],
  },
};

export default function Home() {
  return (
    <section className="flex w-full flex-col items-center">
      <div className="w-full">
        <HeaderHome/>
      </div>
      <div className="w-full">
        <BannerHomepage/>
      </div>
      <div className="w-full">
        <CategorieHomepage/>
      </div>
      <div className="w-full max-w-7xl border">
        OTHER
      </div>
    </section>
  );
}