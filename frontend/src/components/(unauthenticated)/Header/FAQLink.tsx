const FAQLink = ({
  faqRef,
}: {
  faqRef: React.MutableRefObject<HTMLDivElement | null>;
}) => {
  return (
    <button
      className="text-sm hover:text-gray-600"
      onClick={() =>
        faqRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start",
        })
      }
    >
      <span aria-label="span-FAQ">FAQ</span>
    </button>
  );
};

export default FAQLink;
