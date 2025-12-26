'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from '@/shared/ui/primitives/select';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

const triggerVariants = cva(
  'w-full rounded-2xl bg-background text-foreground border transition-all duration-200 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
    'data-[state=open]:ring-2 data-[state=open]:ring-ring ' +
    'placeholder:text-muted-foreground flex items-center justify-between',
  {
    variants: {
      tone: {
        default: 'border-border shadow-01',
        error: 'border-[var(--destructive)] focus-visible:ring-[var(--destructive)]',
      },
      fieldSize: {
        sm: 'h-10 px-4',
        md: 'h-[4.375rem] px-5',
        lg: 'h-12 px-6',
      },
      state: {
        enabled: '',
        disabled: 'bg-muted text-muted-foreground border-gray-200 shadow-none cursor-not-allowed',
      },
    },
    defaultVariants: {
      tone: 'default',
      fieldSize: 'md',
      state: 'enabled',
    },
  },
);

//드롭다운 아이템 스타일
const itemVariants = cva(
  'rounded-lg transition-colors cursor-pointer flex items-center justify-between',
  {
    variants: {
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-5 py-4 text-lg',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
      state: {
        default: 'text-foreground hover:bg-accent hover:text-accent-foreground',
        selected: 'bg-accent text-accent-foreground font-medium',
        disabled: 'opacity-40 pointer-events-none text-muted-foreground',
      },
    },
    defaultVariants: {
      size: 'md',
      weight: 'normal',
      state: 'default',
    },
  },
);

//드롭다운 옵션 아이템 타입
export interface DropdownOption {
  value: string;
  text: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

//드롭다운 그룹 타입
export interface DropdownGroup {
  label?: string;
  options: DropdownOption[];
  separator?: boolean;
}

//드롭다운 아이템 스타일 타입
export type ItemSize = 'sm' | 'md' | 'lg';
export type ItemWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type ItemState = 'default' | 'selected' | 'disabled';

export interface DropdownProps
  extends
    Omit<React.ComponentProps<typeof Select>, 'children'>,
    VariantProps<typeof triggerVariants> {
  placeholder?: string;
  label?: string;
  items: DropdownGroup[];
  errorMessage?: string;
  helperText?: string;
  className?: string;
  // 아이템 스타일 커스터마이징
  itemSize?: ItemSize;
  itemWeight?: ItemWeight;
  // 아이콘 커스터마이징
  showChevron?: boolean;
  chevronIcon?: React.ReactNode;
  // 콘텐츠 스타일링
  contentClassName?: string;
  contentHeight?: string; // 드롭다운 콘텐츠 높이
  // 선택된 값 표시 커스터마이징
  valueDisplay?: (value: string, option: DropdownOption) => React.ReactNode;
}

export function Dropdown({
  placeholder = 'dropdown',
  label,
  items,
  tone,
  fieldSize,
  state,
  errorMessage,
  helperText,
  className,
  itemSize = 'md',
  itemWeight = 'normal',
  showChevron = true,
  chevronIcon,
  contentClassName,
  contentHeight,
  valueDisplay,
  value,
  ...selectProps
}: DropdownProps) {
  const id = React.useId();
  const describedBy = errorMessage ? `${id}-error` : helperText ? `${id}-help` : undefined;
  const [isOpen, setIsOpen] = React.useState(false);

  // 선택된 옵션 찾기
  const selectedOption = React.useMemo(() => {
    if (!value) return null;
    for (const group of items) {
      const option = group.options.find((opt) => opt.value === value);
      if (option) return option;
    }
    return null;
  }, [value, items]);

  // 아이템 렌더링 함수
  const renderItem = (option: DropdownOption, isSelected: boolean = false) => {
    const itemState: ItemState = option.disabled ? 'disabled' : isSelected ? 'selected' : 'default';
    const finalWeight = option.weight || itemWeight;

    return (
      <div
        className={cn(
          itemVariants({
            size: itemSize,
            weight: finalWeight,
            state: itemState,
          }),
        )}
      >
        <div className="flex items-center gap-2">
          {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
          <div className="flex flex-col">
            <span>{option.text}</span>
            {option.description && (
              <span className="text-xs text-muted-foreground">{option.description}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {label ? (
        <div
          className={cn(
            'text-foreground',
            fieldSize === 'sm'
              ? 'text-sm font-medium'
              : fieldSize === 'md'
                ? 'text-base font-medium'
                : 'text-lg font-medium',
          )}
        >
          {label}
        </div>
      ) : null}

      <Select
        {...selectProps}
        disabled={state === 'disabled' || selectProps.disabled}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger
          id={id}
          aria-invalid={!!errorMessage}
          aria-describedby={describedBy}
          className={cn(triggerVariants({ tone, fieldSize, state }), className)}
          showIcon={false}
        >
          <div className="flex items-center gap-2 flex-1">
            {selectedOption?.icon && <span className="flex-shrink-0">{selectedOption.icon}</span>}
            <SelectValue placeholder={placeholder}>
              {value && selectedOption && valueDisplay
                ? valueDisplay(value, selectedOption)
                : selectedOption?.text}
            </SelectValue>
          </div>
          {showChevron && (
            <span className="flex-shrink-0 text-muted-foreground">
              {chevronIcon ||
                (isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
            </span>
          )}
        </SelectTrigger>

        <SelectContent
          className={cn(
            'rounded-xl border border-border bg-popover text-popover-foreground shadow-03',
            'p-1 min-w-[200px]',
            contentClassName,
          )}
          style={contentHeight ? { height: contentHeight } : undefined}
          position="popper"
        >
          {items.map((group, gi) => (
            <SelectGroup key={gi}>
              {group.label && (
                <SelectLabel
                  className={cn(
                    'text-muted-foreground px-2 py-1',
                    itemSize === 'sm' ? 'text-xs' : itemSize === 'md' ? 'text-sm' : 'text-base',
                  )}
                >
                  {group.label}
                </SelectLabel>
              )}

              {group.options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="p-0 focus:bg-transparent"
                >
                  {renderItem(option, value === option.value)}
                </SelectItem>
              ))}

              {group.separator && gi < items.length - 1 && <SelectSeparator />}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      {errorMessage ? (
        <p id={`${id}-error`} className="text-sm font-medium text-[var(--destructive)]">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={`${id}-help`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
