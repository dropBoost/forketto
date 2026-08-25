import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQhome ({data}) {

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-7xl">
      <h3 className="font-extrabold text-neutral-50">FAQ</h3>
      <Accordion defaultValue={"item-1"}>
        {data?.map(f => (
        <AccordionItem key={f.value} value={f.value} className={`data-open:bg-neutral-50!`}>
          <AccordionTrigger className={`font-bold text-neutral-50 lg:text-base text-sm data-open:text-primary!`}>{f.title}</AccordionTrigger>
          <AccordionContent className={`text-sm text-neutral-700`}>
            {f.description}
          </AccordionContent>
        </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}