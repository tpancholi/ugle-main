import React from "react";
import GetAccessHero from "../components/getaccess/GetAccessHero";
import GetAccessForm from "../components/getaccess/GetAccessForm";

export default function GetEarlyAccess() {
  return (
    <div className="bg-[#F8FAF9] min-h-[80vh] pt-8 md:pt-12 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <GetAccessHero />

        <GetAccessForm />
      </div>
    </div>
  );
}
