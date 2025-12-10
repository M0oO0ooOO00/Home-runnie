"use client";

import * as React from "react";
import { Button as ShadButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
// import { Filter } from "lucide-react";

/**
 * 필터 아이콘 컴포넌트
 */
const FilterIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path d="M4 6.5H16" stroke="currentColor" strokeLinecap="round" />
    <path d="M4 10.5H16" stroke="currentColor" strokeLinecap="round" />
    <path d="M4 14.5H16" stroke="currentColor" strokeLinecap="round" />
    <circle cx="7" cy="6.5" r="1" fill="currentColor" stroke="currentColor" />
    <circle cx="9" cy="14.5" r="1" fill="currentColor" stroke="currentColor" />
    <circle cx="13" cy="10.5" r="1" fill="currentColor" stroke="currentColor" />
  </svg>
);

/**
 * CTA Small 버튼 변형
 * - primary: 검은색 배경 + 흰색 아이콘/텍스트
 * - secondary: 어두운 회색 배경 + 밝은 회색 아이콘/텍스트
 * - subtle: 밝은 회색 배경 + 중간 회색 아이콘/텍스트
 * - outline: 흰색 배경 + 검은색 테두리 + 검은색 아이콘/텍스트
 *
 * ※ 필터 아이콘과 "필터" 텍스트가 포함된 작은 버튼
 */
const ctaSmallVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg transition-colors select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
    "disabled:cursor-not-allowed b03-r",
  {
    variants: {
      variant: {
        primary: "bg-gray-900 text-white hover:bg-gray-800",
        secondary: "bg-gray-600 text-gray-200 hover:bg-gray-500",
        subtle: "bg-gray-200 text-gray-600 hover:bg-gray-300",
        outline: "bg-white border border-gray-900 text-gray-900 hover:bg-gray-50",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface CtaSmallProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ctaSmallVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  text?: string;
}

/**
 * 작은 CTA 버튼 컴포넌트
 * - 필터 아이콘과 텍스트가 기본으로 포함
 * - 아이콘과 텍스트를 커스터마이징 가능
 * - 4가지 변형 지원
 */
export const CtaSmall = React.forwardRef<HTMLButtonElement, CtaSmallProps>(
  ({ className, variant, size, icon, text = "필터", disabled, ...props }, ref) => {
    return (
      <ShadButton
        ref={ref}
        className={cn(
          ctaSmallVariants({ variant, size }),
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        disabled={disabled}
        {...props}
      >
        <span className="flex-shrink-0">{icon || <FilterIcon className="w-5 h-5" />}</span>
        <span className="font-medium">{text}</span>
      </ShadButton>
    );
  }
);
CtaSmall.displayName = "CtaSmall";

export { ctaSmallVariants };
