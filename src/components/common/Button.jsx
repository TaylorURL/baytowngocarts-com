import React from "react";

/**
 * Reusable button component with primary, secondary, and outline variants,
 * three size options, and optional full-width layout.
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  const baseClasses =
    "font-semibold rounded-lg transition-all duration-300 button-hover flex items-center justify-center";

  const variantClasses = {
    primary:
      "bg-red-600 hover:bg-red-500 text-white shadow-red hover:shadow-lg hover:-translate-y-0.5",
    secondary:
      "bg-navy-800 hover:bg-navy-700 text-white shadow-lg hover:-translate-y-0.5",
    outline:
      "border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white hover:-translate-y-0.5",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
