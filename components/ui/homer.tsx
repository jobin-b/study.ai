"use client";

export default function Homer() {
  return (
    <nav className="flex flex-row align-center justify-start gap-6 p-4 absolute">
      <a
        href="/"
        className="pl-4 pt-4 animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-3xl font-semibold text-transparent transition-all duration-300 hover:bg-[linear-gradient(to_right,theme(colors.indigo.300),theme(colors.purple.500),theme(colors.blue.400))] hover:shadow-lg hover:scale-[1.03]"
        data-aos="fade-up"
      >
        study.ai
      </a>
    </nav>
  );
}
