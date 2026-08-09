

export default function LayoutSito({ children }) {
  return (
    <div className="flex flex-col items-center min-h-screen w-full">
        <main className="flex flex-col flex-1 w-full items-center justify-start">
          {children}
        </main>
    </div>
  );
}