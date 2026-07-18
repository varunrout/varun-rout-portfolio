export function formatNumber(value: number, dp = 0): string {
  return value.toLocaleString('en-GB', {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
}

export function formatPercent(value: number, dp = 0): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${formatNumber(value, dp)}%`;
}
