export default function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  error = "",
  required = false,
  disabled = false,
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full
          rounded-xl
          border
          px-4
          py-3
          outline-none
          transition
          ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-500"
              : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          }
          disabled:bg-slate-100
          disabled:cursor-not-allowed
        `}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
