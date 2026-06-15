import { AlertCircle, CheckCircle, Clock } from "lucide-react";

const STATUS_CONFIG = {
  completed: {
    className: "bg-green-100 text-green-700",
    label: "COMPLETED",
    icon: CheckCircle,
  },
  pending: {
    className: "bg-yellow-100 text-yellow-700",
    label: "PENDING",
    icon: Clock,
  },
};

const FALLBACK_CONFIG = {
  className: "bg-red-100 text-red-700",
  label: null,
  icon: AlertCircle,
};

/**
 * Pill-shaped order status indicator. Used in staff order tables, the user
 * dashboard, and the purchase details page.
 */
const StatusBadge = ({ status, size = "sm" }) => {
  const config = STATUS_CONFIG[status] ?? FALLBACK_CONFIG;
  const Icon = config.icon;
  const sizing =
    size === "lg"
      ? "px-4 py-2 text-sm gap-2"
      : "px-2 py-1 text-xs gap-1";
  const iconSize = size === "lg" ? "h-4 w-4" : "h-3 w-3";
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold ${config.className} ${sizing}`}
    >
      <Icon className={iconSize} />
      {config.label ?? status}
    </span>
  );
};

export default StatusBadge;
