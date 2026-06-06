import { isSameDay } from '@/lib/format';

export const parseMessageDate = (createdAt?: string) => {
  if (!createdAt) return null;

  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getMessageDateDividerDate = (currentDate: Date | null, previousDate: Date | null) => {
  if (!currentDate) return null;
  if (!previousDate) return currentDate;

  return isSameDay(previousDate, currentDate) ? null : currentDate;
};
