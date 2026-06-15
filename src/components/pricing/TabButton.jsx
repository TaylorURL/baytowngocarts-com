/** Single navigation tab in the pricing hero. */
const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    type="button"
    role="tab"
    aria-selected={isActive}
    onClick={onClick}
    className={`px-6 py-3 rounded-xl font-bold text-sm md:text-base transition duration-200 ease-out active:scale-95 ${
      isActive
        ? "bg-red-600 text-white shadow-red"
        : "text-gray-300 hover:text-white hover:bg-white/5"
    }`}
  >
    <Icon className="h-4 w-4 inline mr-2" />
    {label}
  </button>
);

export default TabButton;
