import GenderSection from 'components/gender/GenderSection';

export default function GendersPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Gender Management
      </h1>

      <GenderSection />
    </div>
  );
}
