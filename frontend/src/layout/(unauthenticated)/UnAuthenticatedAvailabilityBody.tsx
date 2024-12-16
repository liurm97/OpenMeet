import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { singleEventResponseDataType } from "@/types/type";

const UnAuthenticatedAvailabilityBody = ({
  eventData,
}: {
  eventData: singleEventResponseDataType;
}) => {
  // const loaderData = useLoaderData();
  // const eventData: singleEventResponseDataType = loaderData.data;
  // console.log(`data:: ${JSON.stringify(data)}`);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Event Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">{eventData?.name}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">12/1 - 12/7</span>
              <Button variant="outline" size="sm">
                Edit event
              </Button>
            </div>
            <button className="mt-2 text-black hover:underline flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span>Agenda</span>
            </button>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Copy className="h-4 w-4" />
              <span>Copy link</span>
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800">
              Add availability
            </Button>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar Grid */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-3 gap-px bg-gray-200">
              <div className="bg-white p-4 text-center font-medium">Dec 1</div>
              <div className="bg-white p-4 text-center font-medium">Dec 2</div>
              <div className="bg-white p-4 text-center font-medium">Dec 3</div>

              {[...Array(6)].map((_, rowIndex) => (
                <>
                  <div
                    key={`row-${rowIndex}-col-1`}
                    className="bg-white p-4 border border-gray-100 h-16 cursor-pointer hover:bg-gray-50"
                  />
                  <div
                    key={`row-${rowIndex}-col-2`}
                    className="bg-white p-4 border border-gray-100 h-16 cursor-pointer hover:bg-gray-50"
                  />
                  <div
                    key={`row-${rowIndex}-col-3`}
                    className="bg-white p-4 border border-gray-100 h-16 cursor-pointer hover:bg-gray-50"
                  />
                </>
              ))}
            </div>
          </div>

          {/* Responses */}
          <div className="lg:w-1/3">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h2 className="font-medium text-xl mb-4">Responses (0)</h2>
              <p className="text-gray-600">
                No responses yet. Share the event link to get responses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UnAuthenticatedAvailabilityBody;
