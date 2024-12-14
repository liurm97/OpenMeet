const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20">
      {/* How it works */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-start space-x-4">
            <span className="text-xl font-bold">1.</span>
            <div>
              <h3 className="text-xl font-semibold">Create an event</h3>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <span className="text-xl font-bold">2.</span>
            <div>
              <h3 className="text-xl font-semibold">
                Send scheduling links to participants
              </h3>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <span className="text-xl font-bold">3.</span>
            <div>
              <h3 className="text-xl font-semibold">
                Find the best time to meet
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
