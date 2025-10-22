import { NumericFormat } from 'react-number-format';

interface NumberFormatTextProps {
  value: number;
  decimalScale?: number;
}

const NumberFormatText = ({ value, decimalScale = 2 }: NumberFormatTextProps) => {
  return (
    <span>
      <NumericFormat
        value={value}
        displayType="text"
        decimalScale={decimalScale}
        thousandSeparator
        valueIsNumericString
      />
    </span>
  );
};

export default NumberFormatText;
