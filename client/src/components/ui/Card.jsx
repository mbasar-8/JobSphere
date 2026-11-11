export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-8 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
