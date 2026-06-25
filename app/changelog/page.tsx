import PageHeader from "../components/sharedpages/PageHeader";
import ChangelogMain from "../components/changelog/ChangelogMain";

export default function page() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <PageHeader
        title="Changelog"
        subtitle="Release notes and updates to the Ugle engine."
      />

      <ChangelogMain />
    </div>
  );
}
