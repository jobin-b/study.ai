export const metadata = {
  title: "study.ai",
  description: "Page description",
};

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/hero-home";
import Workflows from "@/components/workflows";

export default function Home() {
  return (
    <>
      <PageIllustration />
      <Hero />
      <Workflows />
    </>
  );
}
