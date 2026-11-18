import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getApplication, withdrawApplication } from "../../api/application";

import { useAuth } from "../../context/AuthContext";

export default function ApplicationDetails() {
  const { id } = useParams();

  const { token } = useAuth();

  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);

  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    loadApplication();
  }, [id]);

  const loadApplication = async () => {
    setLoading(true);

    try {
      const response = await getApplication(id, token);

      setApplication(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to withdraw this application?",
    );

    if (!confirmed) return;

    if (withdrawing) return;

    setWithdrawing(true);

    try {
      const response = await withdrawApplication(id, token);

      setApplication(response.data.data);

      alert("Application withdrawn successfully.");
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return <p className="text-slate-600">Loading application...</p>;
  }

  if (!application) {
    return (
      <div className="rounded-lg border bg-white p-6">
        Application not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/applications"
        className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline"
      >
        ← Back to Applications
      </Link>

      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          {application.job.title}
        </h1>

        <p className="mt-2 text-lg text-slate-600">
          {application.job.company?.company_name}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {application.job.city?.name}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
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

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-lg font-semibold">Application Status</h2>

            <span
              className={`rounded-full px-4 py-2 text-sm font-medium ${
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

            <p className="mt-4 text-sm text-slate-500">
              Applied: {application.applied_at}
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold">Resume</h2>

            {application.resume ? (
              <a
                href={application.resume}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {application.resume}
              </a>
            ) : (
              <p className="text-slate-500">No resume provided.</p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Cover Letter</h2>

          <div className="rounded-lg border bg-slate-50 p-5">
            {application.cover_letter ? (
              <p className="whitespace-pre-line text-slate-700">
                {application.cover_letter}
              </p>
            ) : (
              <p className="text-slate-500">No cover letter provided.</p>
            )}
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          {application.status !== "withdrawn" && (
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={withdrawing}
              className="rounded-lg border border-red-300 px-6 py-3 font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {withdrawing ? "Withdrawing..." : "Withdraw Application"}
            </button>
          )}

          <Link
            to="/applications"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Back to Applications
          </Link>

          <Link
            to={`/jobs/${application.job.slug}`}
            className="rounded-lg border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100"
          >
            View Job
          </Link>
        </div>
      </div>
    </div>
  );
}
