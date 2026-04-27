import MemberStatusSection from 'components/member-status/MemberStatusSection';

export default function MemberStatusPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Member Status Management
      </h1>

      <MemberStatusSection />
    </div>
  );
}
