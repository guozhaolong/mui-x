import * as React from 'react';
import { useUtils } from './useUtils';
import { PickerOnChangeFn } from './useViews';
import { getMeridiem, convertToMeridiem } from '../utils/time-utils';
import { PickerSelectionState } from './usePicker';

interface MonthValidationOptions<TDate> {
  disablePast?: boolean;
  disableFuture?: boolean;
  minDate: TDate;
  maxDate: TDate;
}

export function useNextMonthDisabled<TDate>(
  month: TDate,
  { disableFuture, maxDate }: Pick<MonthValidationOptions<TDate>, 'disableFuture' | 'maxDate'>,
) {
  const utils = useUtils<TDate>();
  return React.useMemo(() => {
    const now = utils.date()!;
    const lastEnabledMonth = utils.startOfMonth(
      disableFuture && utils.isBefore(now, maxDate) ? now : maxDate,
    );
    return !utils.isAfter(lastEnabledMonth, month);
  }, [disableFuture, maxDate, month, utils]);
}

export function usePreviousMonthDisabled<TDate>(
  month: TDate,
  { disablePast, minDate }: Pick<MonthValidationOptions<TDate>, 'disablePast' | 'minDate'>,
) {
  const utils = useUtils<TDate>();

  return React.useMemo(() => {
    const now = utils.date()!;
    const firstEnabledMonth = utils.startOfMonth(
      disablePast && utils.isAfter(now, minDate) ? now : minDate,
    );
    return !utils.isBefore(firstEnabledMonth, month);
  }, [disablePast, minDate, month, utils]);
}

export function useMeridiemMode<TDate>(
  date: TDate | null,
  ampm: boolean | undefined,
  onChange: PickerOnChangeFn<TDate>,
  selectionState?: PickerSelectionState,
) {
  const utils = useUtils<TDate>();
  const meridiemMode = getMeridiem(date, utils);

  const handleMeridiemChange = React.useCallback(
    (mode: 'am' | 'pm') => {
      const timeWithMeridiem =
        date == null ? null : convertToMeridiem<TDate>(date, mode, Boolean(ampm), utils);
      onChange(timeWithMeridiem, selectionState ?? 'partial');
    },
    [ampm, date, onChange, selectionState, utils],
  );

  return { meridiemMode, handleMeridiemChange };
}
