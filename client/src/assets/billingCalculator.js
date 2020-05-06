function getMonthlyFac(start, end) {
  var months;
  months = (end.getFullYear() - start.getFullYear()) * 12;
  months -= start.getMonth();
  months += end.getMonth();
  return months <= 0 ? 0 : months;
}

export { getMonthlyFac };
