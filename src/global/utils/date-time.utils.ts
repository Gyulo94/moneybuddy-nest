import { parse } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

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
