import CategorieHomepage from "@/components/sito/theme/categorieHome";
import Footer from "@/components/sito/theme/footer";
import HeaderHome from "@/components/sito/theme/headerHome";
import { getMenuCategorie } from "@/lib/menu/getMenuCategorie";
import HeroBanner from "@/components/sito/theme/heroBanner";

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

export default async function Home() {

  const categorie = await getMenuCategorie()

  return (
    <>
    <HeaderHome/>
    <section className="flex w-full flex-col items-center">
      <div className="w-full">
        <HeroBanner bgImg="/assets/img/banner_forketto_home.png" bgColor="#ffcc05" titolo="Ciao" height={500}/>
      </div>
      <div className="w-full">
        <CategorieHomepage categorie={categorie}/>
      </div>
    </section>
    <Footer categorie={categorie}/>
    </>
  );
}