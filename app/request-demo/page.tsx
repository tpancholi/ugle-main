import React from "react";
import DemoHero from "../components/demo/DemoHero";
import DemoForm from "../components/demo/DemoForm";

export default function RequestDemo() {
  return (
    <div className="bg-[#1C1C1C] min-h-[80vh] pt-8 md:pt-12 lg:pt-18 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <DemoHero />

          <DemoForm />
        </div>
      </div>
    </div>
  );
}
