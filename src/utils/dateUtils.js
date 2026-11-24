// Date formatting and date calculation utilities

export function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return dateStr;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today - compareDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function formatMonthYear(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + (dateStr.length === 7 ? '-01T00:00:00' : 'T00:00:00'));
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleString('default', { month: 'short', year: 'numeric' });
}

export function getMonthYearKey(date = new Date()) {
  const d = typeof date === 'string' ? new Date(date + (date.length === 7 ? '-01' : '')) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getLastNMonths(count = 6) {
  const months = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('default', { month: 'short' });
    const fullLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' });
    months.push({ key, label, fullLabel, year: d.getFullYear(), month: d.getMonth() + 1 });
  }
  return months;
}

export function isDateInMonth(dateStr, year, month) {
  if (!dateStr) return false;
  const d = new Date(dateStr + 'T00:00:00');
  return d.getFullYear() === year && d.getMonth() + 1 === month;
}
