export default function MateItem({
  match,
  title,
  date,
  isLast,
}: Readonly<{
  match: string;
  title: string;
  date: string;
  isLast: boolean;
}>) {
  const roundedClass = isLast ? "rounded-b-2xl" : "";

  return (
    <div className={`px-[40px] py-[20px] bg-white ${roundedClass}`}>
      <div className="flex justify-between text-b02-m">
        <div className="flex items-center gap-10">
          <p className="w-[120px]">{match}</p>
          <p className="text-gray-600 truncate">{title}</p>
        </div>
        <p>{date}</p>
      </div>
    </div>
  );
}
