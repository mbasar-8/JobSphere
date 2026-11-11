import { useRef } from "react";

export default function OtpInput({ value, onChange, disabled = false }) {
  const inputRefs = useRef([]);

  const handleChange = (index, inputValue) => {
    const digit = inputValue.replace(/\D/g, "").slice(-1);

    const otp = value.split("");
    otp[index] = digit;

    onChange(otp.join(""));

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    onChange(pasted);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          ref={(element) => (inputRefs.current[index] = element)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[index] || ""}
          disabled={disabled}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          className="h-12 w-12 rounded-xl border border-slate-300 text-center text-lg font-semibold outline-none transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
