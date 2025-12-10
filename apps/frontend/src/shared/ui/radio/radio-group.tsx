"use client";

import clsx from "clsx";
import * as React from "react";
import Radio from "./radio";

export type RadioValue = string | number;
export type RadioOption = { value: RadioValue; label: React.ReactNode };

type Props = {
  name: string;
  value?: RadioValue;
  onChange?: (v: RadioValue) => void;
  options: RadioOption[];
  disabled?: boolean;
  className?: string;
  size?: "md" | "lg";
  direction?: "col" | "row";
  gapClassName?: string;
};

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  disabled,
  className,
  size = "lg",
  direction = "col",
  gapClassName = "gap-3",
}: Props) {
  return (
    <div
      role="radiogroup"
      className={clsx(
        "inline-flex",
        direction === "col" ? "flex-col" : "flex-row items-center",
        gapClassName,
        className
      )}
    >
      {options.map((opt) => (
        <Radio
          key={String(opt.value)}
          name={name}
          value={opt.value}
          label={opt.label}
          checked={value === opt.value}
          onChange={onChange}
          disabled={disabled}
          size={size}
        />
      ))}
    </div>
  );
}
