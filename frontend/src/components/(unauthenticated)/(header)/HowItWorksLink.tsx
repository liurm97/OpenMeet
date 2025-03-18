import { Compass } from "lucide-react";

const HowItWorksLink = ({
  howItWorksRef,
}: {
  howItWorksRef: React.MutableRefObject<HTMLDivElement | null>;
}) => {
  return (
    <button
      className="text-sm hover:text-gray-600 how-it-works hover:underline hover:underline-offset-4 flex flex-row items-center gap-1"
      onClick={() =>
        howItWorksRef.current?.scrollIntoView({
          behavior: "smooth",
        })
      }
    >
      <Compass />
      <span className="[@media(max-width:770px)]:hidden">How it works</span>
    </button>
  );
};

export default HowItWorksLink;
