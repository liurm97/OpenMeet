import { MessageCircleQuestion } from "lucide-react";

const FAQLink = ({
  faqRef,
}: {
  faqRef: React.MutableRefObject<HTMLDivElement | null>;
}) => {
  return (
    <button
      className="text-sm hover:text-gray-600 hover:underline hover:underline-offset-4 gap-1 flex flex-row items-center"
      onClick={() =>
        faqRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start",
        })
      }
    >
      <MessageCircleQuestion />
      <span className="[@media(max-width:770px)]:hidden" aria-label="span-FAQ">
        FAQ
      </span>
    </button>
  );
};

export default FAQLink;
