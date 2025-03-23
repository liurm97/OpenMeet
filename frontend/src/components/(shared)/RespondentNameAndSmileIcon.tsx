import { Smile, UserCheck2Icon } from "lucide-react";

const RespondentNameAndSmileIcon = ({
  name,
  isGuestRespondent,
}: {
  name: string;
  isGuestRespondent: boolean;
}): JSX.Element => {
  return (
    <>
      <div className="flex flex-row gap-1 items-center">
        {isGuestRespondent == true && <Smile size={16} />}
        {isGuestRespondent == false && <UserCheck2Icon size={16} />}

        <p className={`text-sm group-hover:font-bold `}>{name}</p>
      </div>
    </>
  );
};

export default RespondentNameAndSmileIcon;
