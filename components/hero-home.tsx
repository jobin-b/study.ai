export default function HeroHome() {
  return (
    <section className="h-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pt-12 md:pt-28 pb-8 md:pb-12">
          {/* Section header */}
          <div className="text-center">
            <h1
              className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-7xl font-semibold text-transparent"
              data-aos="fade-up"
            >
              study.ai
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-2xl text-indigo-200/65"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                Your personal AI-powered study assistant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
