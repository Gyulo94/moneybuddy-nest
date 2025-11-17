import { format, parse } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { ErrorCode } from '../enum/error-code.enum';
import { ApiException } from '../exception/api.exception';

const KST_TIMEZONE = 'Asia/Seoul';

/**
 * @param dateStr 날짜 문자열 (예: '2025-11-14')
 * @param timeStr 시간 문자열 (예: '17:00')
 * @returns KST를 기준으로 설정된 Date 객체
 */
export function FromStringToDateTime(dateStr: string, timeStr: string): Date {
  const combinedDateTimeString = `${dateStr} ${timeStr}`;
  const parsedDateAsLocal = parse(
    combinedDateTimeString,
    'yyyy-MM-dd HH:mm',
    new Date(),
  );
  const KST_DATE = fromZonedTime(parsedDateAsLocal, KST_TIMEZONE);

  return KST_DATE;
}

export function FromDateTimeToString(date: Date): {
  dateString: string;
  timeString: string;
} {
  const dateString = format(date, 'yyyy-MM-dd');
  const timeString = format(date, 'HH:mm');
  return { dateString, timeString };
}

export function extractYearMonth(dateString: string): {
  year: number;
  month: number;
} {
  if (!dateString) {
    throw new ApiException(ErrorCode.DATE_NULL_OR_EMPTY);
  }

  let date: Date;

  try {
    if (dateString.length === 10) {
      date = parse(dateString, 'yyyy-MM-dd', new Date());
      return { year: date.getFullYear(), month: date.getMonth() + 1 };
    } else if (dateString.length === 7) {
      date = parse(dateString, 'yyyy-MM', new Date());
      return { year: date.getFullYear(), month: date.getMonth() + 1 };
    } else {
      throw new ApiException(ErrorCode.INVALID_DATE_OR_TIME_FORMAT);
    }
  } catch (error) {
    throw new ApiException(ErrorCode.INVALID_DATE_OR_TIME_FORMAT);
  }
}

export function getMonthStartDateTime(year: number, month: number): Date {
  try {
    const firstDayOfMonth = new Date(year, month - 1, 1, 0, 0, 0);
    const KST_START_DATE = fromZonedTime(firstDayOfMonth, KST_TIMEZONE);
    return KST_START_DATE;
  } catch (error) {
    throw new ApiException(ErrorCode.INVALID_DATE_OR_TIME_FORMAT);
  }
}

export function getMonthEndDateTime(year: number, month: number): Date {
  try {
    const lastDayOfMonth = new Date(year, month, 0, 23, 59, 59);
    const KST_END_DATE = fromZonedTime(lastDayOfMonth, KST_TIMEZONE);
    return KST_END_DATE;
  } catch (error) {
    throw new ApiException(ErrorCode.INVALID_DATE_OR_TIME_FORMAT);
  }
}
