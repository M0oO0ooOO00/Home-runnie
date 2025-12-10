import Image from "next/image";
import Link from "next/link";
import React from "react";

interface BannerCardProps {
  href: string;
  bgColor: string;
  title: React.ReactNode;
  description: string;
  iconSrc: string;
  iconAlt: string;
}

export default function BannerCard({
  href,
  bgColor,
  title,
  description,
  iconSrc,
  iconAlt,
}: BannerCardProps) {
  return (
    <Link href={href} className={`block w-1/2 h-[275px] p-[30px] ${bgColor} rounded-[18px]`}>
      <div className="flex justify-between h-full">
        <div className="flex flex-col gap-[12px]">
          <p className="text-white text-[28px] font-bold">{title}</p>
          <p className="text-gray-100 text-b02-r">{description}</p>
        </div>
        <Image src={iconSrc} alt={iconAlt} width={170} height={170} />
      </div>
    </Link>
  );
}
