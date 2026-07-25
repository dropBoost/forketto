import { ThemeProvider } from "@/components/theme-provider"

export default function POSLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange >
      <div className="flex flex-col justify-start w-270 h-screen max-h-screen ">
        <div className="border h-20">
          CIAO
        </div>
        <div className="flex flex-1 flex-row justify-center border overflow-hidden gap-2">
          <div className="basis-2/12 overflow-y-scroll overflow-x-hidden border-e p-4">
            <p>MENU ITEM</p>
          </div>
          <div className="basis-10/12 overflow-y-scroll overflow-x-hidden">
            {children}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
