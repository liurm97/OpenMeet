import CreateEventForm from "@/components/custom/CreateEventForm";

const UnAuthenticatedMainBody = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 flex flex-row ">
          <div className="max-w-2xl my-20 mx-auto">
            <h1 className="text-4xl font-bold mb-6">
              Scheduling made for students <br />
              by students
            </h1>
            <h2 className="text-2xl mb-4">Let's meet in the open</h2>
            <p className="text-gray-600 text-lg">
              Share your availability with others and find the perfect time to
              meet, without the back-and-forth emails.
            </p>
          </div>
          <div className="max-w-3xl py-10 px-14 mx-auto bg-white">
            <h2 className="text-3xl font-medium">New Event</h2>
            <CreateEventForm className=" py-5 bg-white flex flex-col gap-4" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default UnAuthenticatedMainBody;
