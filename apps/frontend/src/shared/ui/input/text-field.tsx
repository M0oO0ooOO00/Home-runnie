"use client";

import * as React from "react";
import { Input as ShadInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { InputHTMLAttributes } from "react";

const textFieldVariants = cva(
  "block w-full rounded-2xl bg-background text-foreground placeholder:text-muted-foreground " +
    "transition-shadow focus-visible:outline-none border " +
    "focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      tone: {
        default: "border-border shadow-01",
        error: "border-[var(--destructive)] focus-visible:ring-[var(--destructive)]",
      },
      size: {
        md: "h-[4.375rem] px-5 b02-r",
        sm: "h-10 px-4 b03-r",
      },
      state: {
        enabled: "",
        disabled:
          "bg-muted text-muted-foreground placeholder:text-gray-400 " +
          "border-gray-200 shadow-none cursor-not-allowed opacity-100",
      },
    },
    compoundVariants: [
      {
        tone: "error",
        state: "disabled",
        class: "border-[color:rgb(229_72_77_/_.35)] ring-0",
      },
    ],
    defaultVariants: {
      tone: "default",
      size: "md",
      state: "enabled",
    },
  }
);

type InputPropsWithoutSize = Omit<InputHTMLAttributes<HTMLInputElement>, "size">;

export interface TextFieldProps
  extends InputPropsWithoutSize, VariantProps<typeof textFieldVariants> {
  errorMessage?: string;
  helperText?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, tone, size, state, errorMessage, helperText, id, ...props }, ref) => {
    const autoId = React.useId();
    const computedId = id ?? autoId;

    const describedBy = errorMessage
      ? `${computedId}-error`
      : helperText
        ? `${computedId}-help`
        : undefined;

    return (
      <div className="space-y-2">
        <ShadInput
          id={computedId}
          ref={ref}
          className={cn(textFieldVariants({ tone, size, state }), className)}
          aria-invalid={!!errorMessage}
          aria-describedby={describedBy}
          disabled={state === "disabled" || props.disabled}
          {...props}
        />

        {errorMessage ? (
          <p id={`${computedId}-error`} className="c01-m text-[var(--destructive)]">
            {errorMessage}
          </p>
        ) : helperText ? (
          <p id={`${computedId}-help`} className="c01-r text-muted-foreground">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);
TextField.displayName = "TextField";
