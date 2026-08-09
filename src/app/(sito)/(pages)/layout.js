import Footer from "@/components/sito/theme/footer";
import Header from "@/components/sito/theme/header";
import { getMenuCategorie } from "@/lib/menu/getMenuCategorie";

export const metadata = {
  title: "Sito",
  description: "Scopri Forketto.",
};

export default async function LayoutSitoPages({ children }) {

  const categorie = await getMenuCategorie()

  return (
    <div className="flex flex-col items-center min-h-screen w-full ">
      <Header />
      <div className="flex flex-col flex-1 w-full min-h-20 items-center justify-start">
        {children}
      </div>
      <Footer categorie={categorie}/>
    </div>
  );
}