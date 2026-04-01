import { FiLoader } from "react-icons/fi";

export default function Button({
  children,
  loading = false,
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  disabled,
  ...props
}) {
  const base =
    "flex items-center justify-center gap-2 font-medium rounded-lg transition active:scale-95";

  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    danger: " bg-red-50 text-red-600 hover:bg-red-100",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    warning: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
    outline: "border border-gray-600 text-gray-300 hover:bg-gray-800",
    lightgray: "bg-gray-50 border border-gray-100 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700",
    ghost: "text-gray-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        ${base}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {loading ? (
        <FiLoader className="animate-spin" />
      ) : icon ? (
        icon
      ) : null}

      {children && <span className={base}>{children}</span>}
    </button>
  );
}