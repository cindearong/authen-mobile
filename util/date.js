export function getFormattedDate(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  return dateObj.toISOString().slice(0, 10);
}

export function getDateMinusdays(date, days) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}