import { Check } from "lucide-react";
import { parsePriceString } from "../../lib/pricing.js";
import { formatDollars } from "../../lib/format.js";
import QuantityStepper from "./QuantityStepper.jsx";

/**
 * Compact racing product card used in the individual + double-seater grids.
 * Renders the product icon, name, price, top features, quantity stepper,
 * and live subtotal once a quantity is selected.
 */
const RacingProductCard = ({
  product,
  quantity,
  icon: Icon,
  iconWrapperClass,
  iconClass,
  perUnitLabel = "per person",
  features = product.features,
  popularLabel = "BEST VALUE",
  onUpdateQuantity,
  onSetQuantity,
}) => {
  const isSelected = quantity > 0;
  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-md border-2 transition duration-200 ease-out ${
        product.isPopular
          ? "border-red-500"
          : isSelected
            ? "border-red-400"
            : "border-gray-100 hover:border-gray-200 hover:shadow-lg"
      } ${isSelected ? "ring-2 ring-red-200" : ""}`}
    >
      {product.isPopular && (
        <div className="text-center mb-2">
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full tracking-wider">
            {popularLabel}
          </span>
        </div>
      )}
      <div className="text-center mb-3">
        <div className={`inline-flex p-2 rounded-lg mb-2 ${iconWrapperClass}`}>
          <Icon className={`h-5 w-5 ${iconClass}`} />
        </div>
        <h3 className="font-bold text-gray-800 text-sm leading-tight">
          {product.name}
        </h3>
        <div className="font-display text-3xl text-gray-800 mt-1 tracking-wide">
          {product.price}
        </div>
        <p className="text-xs text-gray-500">{perUnitLabel}</p>
      </div>
      <ul className="space-y-1 mb-3">
        {features.map((feature, idx) => (
          <li
            key={idx}
            className="flex items-start text-xs text-gray-600"
          >
            <Check
              size={12}
              className="text-green-600 mr-1 mt-0.5 flex-shrink-0"
            />
            {feature}
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-100">
        <QuantityStepper
          quantity={quantity}
          productName={product.name}
          onDecrement={() => onUpdateQuantity(product.id, -1)}
          onIncrement={() => onUpdateQuantity(product.id, 1)}
          onChange={(e) => onSetQuantity(product.id, e.target.value)}
        />
      </div>
      {isSelected && (
        <div className="mt-2 bg-red-50 rounded-lg py-1 text-center">
          <span className="font-display text-red-600 text-lg tracking-wide">
            {formatDollars(parsePriceString(product.price) * quantity)}
          </span>
        </div>
      )}
    </div>
  );
};

export default RacingProductCard;
