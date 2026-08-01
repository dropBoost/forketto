import Footer from "@/components/sito/theme/footer";
import Header from "@/components/sito/theme/header";

export const metadata = {
  title: "Sito",
  description: "Scopri Forketto.",
};

export default function LayoutSito({ children }) {
  return (
    <div className="flex flex-col items-center min-h-screen w-full">
      <Header />
        <main className="flex flex-col flex-1 w-full items-center justify-start border">
          {children}
        </main>
      <Footer/>
    </div>
  );
}