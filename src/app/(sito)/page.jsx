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
    <section className="flex w-full flex-col items-center max-w-7xl border">
      <h1>HOme</h1>
    </section>
  );
}