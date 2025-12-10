"use client";

import clsx from "clsx";
import * as React from "react";

type RadioValue = string | number;

type Props = {
  name: string;
  value: RadioValue;
  label: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: RadioValue) => void;
  disabled?: boolean;
  className?: string;
  size?: "md" | "lg";
};

export default function Radio({
  name,
  value,
  label,
  checked,
  defaultChecked,
  onChange,
  disabled,
  className,
  size = "lg",
}: Props) {
  const id = React.useId();

  const circleSize = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  const dotSize = size === "lg" ? "h-2.5 w-2.5" : "h-2 w-2";

  return (
    <label
      htmlFor={id}
      className={clsx(
        "inline-flex items-center gap-4 select-none",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className
      )}
    >
      <span
        className={clsx(
          "relative shrink-0 rounded-full",
          circleSize,
          "ring-offset-2 transition-shadow"
        )}
      >
        <input
          id={id}
          name={name}
          type="radio"
          value={String(value)}
          className="peer sr-only"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={() => onChange?.(value)}
        />
        <span
          aria-hidden
          className={clsx(
            "absolute inset-0 rounded-full border",
            "border-zinc-400 bg-transparent",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-main-green"
          )}
        />
        <span
          aria-hidden
          className={clsx(
            "absolute inset-0 grid place-items-center transition-transform",
            "peer-checked:scale-100 scale-0"
          )}
        >
          <span className={clsx("rounded-full", dotSize, "bg-main-green")} />
        </span>
      </span>

      <span
        className={clsx(
          size === "lg" ? "text-xl font-medium leading-7" : "text-base font-medium leading-6",
          "text-zinc-500 font-['Pretendard']"
        )}
      >
        {label}
      </span>
    </label>
  );
}
