import Icon from "./Icon.jsx";

const STATUS_CONFIG = {
  completed: {
    className: "bg-green-100 text-green-700",
    label: "PAID",
    icon: "check-circle",
  },
  pending: {
    className: "bg-caution-100 text-caution-700",
    label: "PENDING",
    icon: "clock",
  },
};

const FALLBACK_CONFIG = {
  className: "bg-race-100 text-race-700",
  label: null,
  icon: "alert-circle",
};

const StatusBadge = ({ status, size = "sm" }) => {
  const config = STATUS_CONFIG[status] ?? FALLBACK_CONFIG;
  const sizing =
    size === "lg"
      ? "px-4 py-2 text-sm gap-2"
      : "px-2 py-1 text-xs gap-1";
  const iconSize = size === "lg" ? "h-4 w-4" : "h-3 w-3";
  return (
    <span
      className={`inline-flex items-center rounded-full font-display tracking-speedway uppercase ${config.className} ${sizing}`}
    >
      <Icon name={config.icon} className={iconSize} />
      {config.label ?? status}
    </span>
  );
};

export default StatusBadge;
