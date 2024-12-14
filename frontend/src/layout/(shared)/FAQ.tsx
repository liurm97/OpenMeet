import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  {
    /* FAQ Section */
  }
  return (
    <section id="faq" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible>
            <AccordionItem value="what-is">
              <AccordionTrigger>What is OpenMeet?</AccordionTrigger>
              <AccordionContent>
                OpenMeet is a scheduling platform that makes it easy to
                coordinate meetings and find the perfect time to meet with
                others.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="feedback">
              <AccordionTrigger>How can I provide feedback?</AccordionTrigger>
              <AccordionContent>
                We welcome your feedback! You can reach out to our support team
                or use the feedback form in your account settings.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
