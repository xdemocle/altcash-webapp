interface NumberFormatTextProps {
  value: number;
  decimalScale?: number;
}

const NumberFormatText = ({ value, decimalScale = 2 }: NumberFormatTextProps) => {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalScale,
    maximumFractionDigits: decimalScale,
  }).format(value);

  return <span suppressHydrationWarning>{formatted}</span>;
};

export default NumberFormatText;
