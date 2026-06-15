import Icon from "../common/Icon.jsx";

const TabButton = ({ iconName, label, isActive, onClick }) => (
  <button
    type="button"
    role="tab"
    aria-selected={isActive}
    onClick={onClick}
    className={`px-6 py-3 rounded-md font-display tracking-speedway uppercase text-sm md:text-base transition duration-base ease-snap active:scale-95 ${
      isActive
        ? "bg-race-600 text-chalk shadow-race"
        : "text-gray-300 hover:text-chalk hover:bg-white/5"
    }`}
  >
    <Icon name={iconName} className="h-4 w-4 inline mr-2" />
    {label}
  </button>
);

export default TabButton;
