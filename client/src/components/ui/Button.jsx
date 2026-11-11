export default function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        flex w-full items-center justify-center rounded-xl
        bg-blue-600 px-4 py-3 font-medium text-white
        transition-colors duration-200
        hover:bg-blue-700
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${className}
      `}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
