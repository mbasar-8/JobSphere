import { User } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function TopNavbar() {
  const { user } = useAuth();

  const roleLabel = {
    candidate: "Candidate",
    recruiter: "Recruiter",
    admin: "Admin",
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4">
        {/* Role Badge */}
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {roleLabel[user?.role] || "User"}
        </span>

        {/* User Email */}
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">{user?.email}</p>

          <p className="text-xs text-slate-500">Logged In</p>
        </div>

        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
          <User size={20} className="text-slate-600" />
        </div>
      </div>
    </header>
  );
}
