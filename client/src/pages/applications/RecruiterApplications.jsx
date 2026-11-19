import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getRecruiterApplications } from "../../api/application";

import { useAuth } from "../../context/AuthContext";

export default function RecruiterApplications() {
  const { token } = useAuth();

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);

    try {
      const response = await getRecruiterApplications(token);

      setApplications(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-slate-600">Loading applications...</p>;
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <p className="text-slate-600">No applications found.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">
        Job Applications
      </h1>

      <div className="space-y-4">
        {applications.map((application) => (
          <div
            key={application.id}
            className="rounded-lg border bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col justify-between gap-6 md:flex-row">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900">
                  {application.candidate.full_name}
                </h2>

                <p className="mt-1 text-slate-600">
                  {application.candidate.headline || "No headline"}
                </p>

                <div className="mt-4 space-y-1 text-sm text-slate-500">
                  <p>
                    <span className="font-medium">Job:</span>{" "}
                    {application.job.title}
                  </p>

                  <p>
                    <span className="font-medium">Company:</span>{" "}
                    {application.job.company.company_name}
                  </p>

                  <p>
                    <span className="font-medium">City:</span>{" "}
                    {application.candidate.city?.name ?? "N/A"}
                  </p>

                  <p>
                    <span className="font-medium">Applied:</span>{" "}
                    {application.applied_at}
                  </p>
                </div>

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
              </div>

              <div className="flex flex-col items-start gap-4 md:items-end">
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
                              : application.status === "withdrawn"
                                ? "bg-slate-200 text-slate-700"
                                : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {application.status}
                </span>

                <Link
                  to={`/recruiter/applications/${application.id}`}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
