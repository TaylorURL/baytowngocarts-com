import { parsePriceString } from "../../lib/pricing.js";
import { formatDollars } from "../../lib/format.js";
import Icon from "../common/Icon.jsx";
import QuantityStepper from "./QuantityStepper.jsx";

const RacingProductCard = ({
  product,
  quantity,
  iconName,
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
      className={`bg-white rounded-lg p-4 shadow-track border-2 transition duration-base ease-snap ${
        product.isPopular
          ? "border-race-500"
          : isSelected
            ? "border-race-400"
            : "border-asphalt-100 hover:border-asphalt-200 hover:shadow-lift"
      } ${isSelected ? "ring-2 ring-race-200" : ""}`}
    >
      {product.isPopular && (
        <div className="text-center mb-2">
          <span className="bg-race-600 text-chalk text-xs font-display tracking-speedway uppercase px-3 py-1 rounded-full">
            {popularLabel}
          </span>
        </div>
      )}
      <div className="text-center mb-3">
        <div className={`inline-flex p-2 rounded-md mb-2 ${iconWrapperClass}`}>
          <Icon name={iconName} className={`h-5 w-5 ${iconClass}`} />
        </div>
        <h3 className="font-bold text-asphalt-900 text-sm leading-tight">
          {product.name}
        </h3>
        <div className="font-display text-3xl text-asphalt-900 mt-1 tracking-wide tabular-nums">
          {product.price}
        </div>
        <p className="text-xs text-asphalt-500">{perUnitLabel}</p>
      </div>
      <ul className="space-y-1 mb-3">
        {features.map((feature, idx) => (
          <li
            key={idx}
            className="flex items-start text-xs text-asphalt-600"
          >
            <Icon
              name="check"
              className="h-3 w-3 text-race-600 mr-1 mt-0.5 flex-shrink-0"
            />
            {feature}
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-center gap-2 pt-3 border-t border-asphalt-100">
        <QuantityStepper
          quantity={quantity}
          productName={product.name}
          onDecrement={() => onUpdateQuantity(product.id, -1)}
          onIncrement={() => onUpdateQuantity(product.id, 1)}
          onChange={(e) => onSetQuantity(product.id, e.target.value)}
        />
      </div>
      {isSelected && (
        <div className="mt-2 bg-race-50 rounded-md py-1 text-center">
          <span className="font-display text-race-600 text-lg tracking-wide tabular-nums">
            {formatDollars(parsePriceString(product.price) * quantity)}
          </span>
        </div>
      )}
    </div>
  );
};

export default RacingProductCard;
