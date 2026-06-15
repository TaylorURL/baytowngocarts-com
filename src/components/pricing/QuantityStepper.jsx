import { Minus, Plus } from "lucide-react";

const STEPPER_SIZES = {
  sm: { button: "w-8 h-8", icon: "h-4 w-4", input: "w-12 py-1 text-sm" },
  lg: { button: "w-10 h-10", icon: "h-5 w-5", input: "w-16 py-2 text-lg" },
};

const QuantityStepper = ({
  quantity,
  productName,
  onDecrement,
  onIncrement,
  onChange,
  size = "sm",
}) => {
  const { button, icon, input } = STEPPER_SIZES[size];
  const isEmpty = quantity === 0;
  return (
    <>
      <button
        type="button"
        onClick={onDecrement}
        disabled={isEmpty}
        aria-label={`Decrease ${productName} quantity`}
        className={`${button} rounded-lg flex items-center justify-center transition duration-150 ease-out ${
          isEmpty
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300 text-gray-700 active:scale-95"
        }`}
      >
        <Minus className={icon} />
      </button>
      <input
        type="number"
        min="0"
        value={quantity}
        onChange={onChange}
        aria-label={`${productName} quantity`}
        className={`${input} text-center font-bold text-gray-800 border-2 border-gray-200 rounded-lg transition-colors duration-150 ease-out focus:border-red-500`}
      />
      <button
        type="button"
        onClick={onIncrement}
        aria-label={`Increase ${productName} quantity`}
        className={`${button} rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition duration-150 ease-out active:scale-95`}
      >
        <Plus className={icon} />
      </button>
    </>
  );
};

export default QuantityStepper;
