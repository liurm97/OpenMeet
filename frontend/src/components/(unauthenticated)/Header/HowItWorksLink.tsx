const HowItWorksLink = ({
  howItWorksRef,
}: {
  howItWorksRef: React.MutableRefObject<HTMLDivElement | null>;
}) => {
  return (
    <button
      className="text-sm hover:text-gray-600 how-it-works"
      onClick={() =>
        howItWorksRef.current?.scrollIntoView({
          behavior: "smooth",
        })
      }
    >
      How it works
    </button>
  );
};

export default HowItWorksLink;
