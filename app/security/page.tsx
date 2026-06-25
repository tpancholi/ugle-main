import React from "react";
import PageHeader from "../components/sharedpages/PageHeader";
import SecurityMain from "../components/security/SecurityMain";

export default function Security() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 ">
      <PageHeader
        badge="Security Architecture"
        title="Your files never leave your machine."
        subtitle="Not a privacy policy. An architecture decision. Ugle has no server-side infrastructure to receive your recordings."
      />

      <SecurityMain />
    </div>
  );
}
