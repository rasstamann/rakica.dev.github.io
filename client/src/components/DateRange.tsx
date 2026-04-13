import type { SupportedLocale } from '../types';
import { formatDate, PRESENT_LABEL } from '../utils/dateFormat';

type DateRangeProps = {
  startDate: string;
  endDate: string | null;
  locale: SupportedLocale;
  singleMonthCollapse?: boolean;
};

export function DateRange({ startDate, endDate, locale, singleMonthCollapse = false }: DateRangeProps) {
  const start = formatDate(startDate, locale);
  const end = endDate ? formatDate(endDate, locale) : PRESENT_LABEL[locale];
  const collapse = singleMonthCollapse && startDate === endDate;
  return (
    <span className="text-xs text-neutral-500 whitespace-nowrap">
      {collapse ? start : `${start} – ${end}`}
    </span>
  );
}
