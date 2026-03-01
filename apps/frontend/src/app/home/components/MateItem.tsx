import Link from 'next/link';

export default function MateItem({
  id,
  match,
  title,
  date,
  isLast,
}: Readonly<{
  id: number;
  match: string;
  title: string;
  date: string;
  isLast: boolean;
}>) {
  const roundedClass = isLast ? 'rounded-b-2xl' : '';

  return (
    <Link
      href={`/home/${id}`}
      className={`block px-[40px] py-[20px] bg-white hover:bg-gray-50 transition-colors ${roundedClass}`}
    >
      <div className="flex justify-between text-b02-m">
        <div className="flex items-center gap-10">
          <p className="w-[120px]">{match}</p>
          <p className="text-gray-600 truncate">{title}</p>
        </div>
        <p>{date}</p>
      </div>
    </Link>
  );
}
