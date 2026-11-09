export default function Card({ children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
      {children}
    </div>
  );
}
