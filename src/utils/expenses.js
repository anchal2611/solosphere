export const getCurrentMonthKey = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}`;
};

const getExpenseMonthKey = (date) => {
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date.slice(0, 7);
  }

  const parsedDate = typeof date?.toDate === 'function'
    ? date.toDate()
    : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return getCurrentMonthKey(parsedDate);
};

export const getCurrentMonthExpenses = (expenses, date = new Date()) => {
  const monthKey = getCurrentMonthKey(date);
  return expenses.filter(expense => getExpenseMonthKey(expense.date) === monthKey);
};
