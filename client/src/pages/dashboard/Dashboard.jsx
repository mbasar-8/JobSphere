import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDashboard } from "../../api/dashboard";

import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { token, user } = useAuth();

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const response = await getDashboard(token);

      setDashboard(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-slate-600">Loading dashboard...</p>;
  }

  if (!dashboard) {
    return (
      <div className="rounded-lg border bg-white p-8">
        Unable to load dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome, {user?.role === "candidate" ? "Candidate" : "Recruiter"}
        </h1>

        <p className="mt-2 text-slate-600">
          Here's an overview of your account.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboard.role === "candidate" ? (
          <>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Saved Jobs</p>

              <h2 className="mt-2 text-3xl font-bold">
                {dashboard.saved_jobs}
              </h2>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Total Applications</p>

              <h2 className="mt-2 text-3xl font-bold">
                {dashboard.total_applications}
              </h2>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Pending Applications</p>

              <h2 className="mt-2 text-3xl font-bold">
                {dashboard.pending_applications}
              </h2>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Profile Status</p>

              <h2 className="mt-2 text-lg font-semibold text-green-600">
                {dashboard.profile_completed ? "Completed" : "Incomplete"}
              </h2>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Total Jobs</p>

              <h2 className="mt-2 text-3xl font-bold">
                {dashboard.total_jobs}
              </h2>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Published Jobs</p>

              <h2 className="mt-2 text-3xl font-bold">
                {dashboard.published_jobs}
              </h2>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Closed Jobs</p>

              <h2 className="mt-2 text-3xl font-bold">
                {dashboard.closed_jobs}
              </h2>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Applications</p>

              <h2 className="mt-2 text-3xl font-bold">
                {dashboard.total_applications}
              </h2>
            </div>
          </>
        )}
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold">Recent Applications</h2>

        {dashboard.recent_applications.length === 0 ? (
          <p className="text-slate-500">No recent applications found.</p>
        ) : (
          <div className="space-y-4">
            {dashboard.recent_applications.map((application) => (
              <div
                key={application.id}
                className="flex flex-col justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-center"
              >
                <div>
                  {dashboard.role === "candidate" ? (
                    <>
                      <h3 className="font-semibold">{application.job.title}</h3>

                      <p className="text-sm text-slate-600">
                        {application.job.company.company_name}
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold">
                        {application.candidate.full_name}
                      </h3>

                      <p className="text-sm text-slate-600">
                        {application.job.title}
                      </p>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                    {application.status}
                  </span>

                  <Link
                    to={
                      dashboard.role === "candidate"
                        ? `/applications/${application.id}`
                        : `/recruiter/applications/${application.id}`
                    }
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {dashboard.role === "candidate" ? (
          <>
            <Link
              to="/jobs"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Browse Jobs
            </Link>

            <Link
              to="/applications"
              className="rounded-lg border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100"
            >
              My Applications
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/jobs"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Manage Jobs
            </Link>

            <Link
              to="/recruiter/applications"
              className="rounded-lg border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100"
            >
              View Applications
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
