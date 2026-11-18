import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getApplications, withdrawApplication } from "../../api/application";

import { useAuth } from "../../context/AuthContext";

export default function Applications() {
  const { token } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);

    try {
      const response = await getApplications(token);

      setApplications(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to withdraw this application?",
    );

    if (!confirmed) return;

    try {
      const response = await withdrawApplication(applicationId, token);

      const updated = response.data.data;

      setApplications((previous) =>
        previous.map((application) =>
          application.id === applicationId ? updated : application,
        ),
      );

      alert("Application withdrawn successfully.");
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message ?? "Something went wrong.");
    }
  };

  if (loading) {
    return <p className="text-slate-600">Loading applications...</p>;
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <p className="text-slate-600">You haven't applied for any jobs yet.</p>

        <Link
          to="/jobs"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">
        My Applications
      </h1>

      <div className="space-y-4">
        {applications.map((application) => (
          <div
            key={application.id}
            className="rounded-lg border bg-white p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-slate-800">
              {application.job.title}
            </h2>

            <p className="mt-1 text-slate-600">
              {application.job.company?.company_name}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {application.job.city?.name}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded bg-blue-100 px-3 py-1 text-sm">
                {application.job.employment_type}
              </span>

              <span className="rounded bg-green-100 px-3 py-1 text-sm">
                {application.job.workplace_type}
              </span>

              <span className="rounded bg-purple-100 px-3 py-1 text-sm">
                {application.job.experience_level}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  application.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : application.status === "reviewed"
                      ? "bg-blue-100 text-blue-800"
                      : application.status === "shortlisted"
                        ? "bg-indigo-100 text-indigo-800"
                        : application.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : application.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-slate-200 text-slate-700"
                }`}
              >
                {application.status}
              </span>

              <span className="text-sm text-slate-500">
                Applied: {application.applied_at}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={`/applications/${application.id}`}
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                View Details
              </Link>

              {application.status !== "withdrawn" && (
                <button
                  type="button"
                  onClick={() => handleWithdraw(application.id)}
                  className="rounded-lg border border-red-300 px-5 py-2 text-red-600 hover:bg-red-50"
                >
                  Withdraw
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
