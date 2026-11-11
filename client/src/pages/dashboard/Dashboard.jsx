import { useAuth } from "../../context/AuthContext";

import Card from "../../components/ui/Card";

export default function Dashboard() {
  const { user } = useAuth();

  const roleLabel = {
    candidate: "Candidate",
    recruiter: "Recruiter",
    admin: "Admin",
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome to JobSphere 👋
        </h1>

        <p className="mt-2 text-slate-600">You have successfully logged in.</p>
      </Card>

      {/* User Information */}
      <Card>
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Account Information
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="font-medium text-slate-600">Email</span>

            <span className="text-slate-900">{user?.email}</span>
          </div>

          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="font-medium text-slate-600">Role</span>

            <span className="text-slate-900">
              {roleLabel[user?.role] || "Unknown"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-slate-600">Status</span>

            <span className="font-semibold text-green-600">Authenticated</span>
          </div>
        </div>
      </Card>

      {/* Coming Soon */}
      <Card>
        <h2 className="mb-2 text-lg font-semibold text-slate-900">
          What's Next?
        </h2>

        <p className="text-slate-600">
          Your dashboard foundation is ready. The next step is to complete your
          profile and unlock JobSphere features.
        </p>
      </Card>
    </div>
  );
}
