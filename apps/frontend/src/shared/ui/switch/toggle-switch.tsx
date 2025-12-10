"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * 토글 스위치 변형
 * - 일반적인 토글 스위치 디자인
 * - 켜짐: 녹색 배경 + 흰색 손잡이
 * - 꺼짐: 회색 배경 + 회색 손잡이
 */
const toggleVariants = cva(
  "peer inline-flex h-[30px] w-[60px] shrink-0 cursor-pointer items-center rounded-full border-0 transition-all " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
    "disabled:cursor-not-allowed disabled:opacity-50 bg-gray-200",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-gray-200",
        primary: "data-[state=checked]:bg-gray-200",
        success: "data-[state=checked]:bg-gray-200",
      },
      size: {
        sm: "h-5 w-9",
        md: "h-[30px] w-[60px]",
        lg: "h-7 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const thumbVariants = cva(
  "pointer-events-none block rounded-full ring-0 transition-transform h-6 w-6 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-gray-400 data-[state=checked]:bg-green-500",
        primary: "bg-gray-400 data-[state=checked]:bg-green-500",
        success: "bg-gray-400 data-[state=checked]:bg-green-500",
      },
      size: {
        sm: "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5",
        md: "h-6 w-6 data-[state=checked]:translate-x-[30px] data-[state=unchecked]:translate-x-[3px]",
        lg: "h-6 w-6 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ToggleSwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root>, VariantProps<typeof toggleVariants> {
  label?: string;
  description?: string;
  disabled?: boolean;
}

/**
 * 토글 스위치 컴포넌트
 * - 일반적인 토글 스위치 디자인
 * - 켜짐/꺼짐 상태를 시각적으로 명확하게 표시
 * - 접근성 완벽 지원
 */
export const ToggleSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  ToggleSwitchProps
>(({ className, variant, size, label, description, disabled, ...props }, ref) => {
  const id = React.useId();

  return (
    <div className="flex items-center space-x-3">
      <SwitchPrimitive.Root
        ref={ref}
        id={id}
        className={cn(toggleVariants({ variant, size }), className)}
        disabled={disabled}
        {...props}
      >
        <SwitchPrimitive.Thumb className={cn(thumbVariants({ variant, size }))} />
      </SwitchPrimitive.Root>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label htmlFor={id} className="b03-m text-foreground cursor-pointer">
              {label}
            </label>
          )}
          {description && <span className="c01-r text-muted-foreground">{description}</span>}
        </div>
      )}
    </div>
  );
});
ToggleSwitch.displayName = "ToggleSwitch";

export { toggleVariants, thumbVariants };
