import { Link } from "react-router-dom";

/*
 * One button, rendered as whatever it actually is.
 *
 * A button that navigates is a link, so `to` renders a router link and `href`
 * an anchor, both carrying the button's own classes. Wrapping a <button> in a
 * link instead leaves the anchor collapsed to its text line while the button
 * inside it paints the box, so the thing a thumb is aiming at measures two
 * lines high whatever padding the button carries.
 */

const BASE =
  "font-display tracking-speedway rounded-md button-hover inline-flex items-center justify-center gap-2 select-none";

const VARIANTS = {
  primary:
    "bg-race-600 text-chalk shadow-race hover:bg-race-500 hover:-translate-y-0.5 hover:shadow-lift focus-visible:ring-2 focus-visible:ring-race-300",
  secondary:
    "bg-asphalt-800 text-chalk shadow-track hover:bg-asphalt-700 hover:-translate-y-0.5",
  outline:
    "border-2 border-race-600 text-race-600 hover:bg-race-600 hover:text-chalk hover:-translate-y-0.5",
  light:
    "bg-chalk text-asphalt-900 hover:bg-white hover:-translate-y-0.5 shadow-lift",
  outlineLight:
    "border-2 border-chalk/80 text-chalk hover:bg-chalk hover:text-asphalt-900 hover:-translate-y-0.5",
  ignite:
    "bg-ignite-500 text-asphalt-950 hover:bg-ignite-400 hover:-translate-y-0.5 shadow-track",
  ghost: "text-asphalt-700 hover:bg-asphalt-100/60 hover:text-asphalt-900",
};

const SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
  xl: "px-10 py-5 text-xl",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  to,
  href,
  ...rest
}) => {
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";
  const classes = `${BASE} ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size]} ${widthClass} ${disabledClass} ${className}`;

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
