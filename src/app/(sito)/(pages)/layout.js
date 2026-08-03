import Footer from "@/components/sito/theme/footer";
import Header from "@/components/sito/theme/header";

export const metadata = {
  title: "Sito",
  description: "Scopri Forketto.",
};

export default function LayoutSitoPages({ children }) {
  return (
    <div className="flex flex-col items-center w-full">
      <Header />
        <div className="flex flex-col flex-1 w-full items-center justify-start border min-h-20">
          {children}
        </div>
      <Footer/>
    </div>
  );
}