import SignUpForm from './components/SignUpForm';

export default function Page({ searchParams }: { searchParams: { memberId?: string } }) {
  const memberId = searchParams.memberId ? parseInt(searchParams.memberId) : undefined;

  return (
    <div className="flex flex-col gap-[56px]">
      <SignUpForm memberId={memberId} />
    </div>
  );
}
