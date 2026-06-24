import Hero from "./components/homepage/Hero";
import HowItWorks from "./components/homepage/HowItWorks";
import Problem from "./components/homepage/Problem";
import Workflow from "./components/homepage/Workflow";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <Workflow />
    </>
  );
}
