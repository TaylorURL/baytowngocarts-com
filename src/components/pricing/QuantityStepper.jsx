import Icon from "../common/Icon.jsx";

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
        className={`${button} rounded-md flex items-center justify-center transition duration-150 ease-snap ${
          isEmpty
            ? "bg-asphalt-100 text-asphalt-300 cursor-not-allowed"
            : "bg-asphalt-100 hover:bg-asphalt-200 text-asphalt-700 active:scale-95"
        }`}
      >
        <Icon name="minus" className={icon} />
      </button>
      <input
        type="number"
        min="0"
        value={quantity}
        onChange={onChange}
        aria-label={`${productName} quantity`}
        className={`${input} text-center font-bold text-asphalt-900 border-2 border-asphalt-200 rounded-md transition-colors duration-150 ease-snap focus:border-race-500 focus:outline-none tabular-nums`}
      />
      <button
        type="button"
        onClick={onIncrement}
        aria-label={`Increase ${productName} quantity`}
        className={`${button} rounded-md bg-race-600 hover:bg-race-500 text-chalk flex items-center justify-center transition duration-150 ease-snap active:scale-95`}
      >
        <Icon name="plus" className={icon} />
      </button>
    </>
  );
};

export default QuantityStepper;
