import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getRecruiterApplication,
  updateRecruiterApplicationStatus,
} from "../../api/application";

import { useAuth } from "../../context/AuthContext";

export default function RecruiterApplicationDetails() {
  const { id } = useParams();

  const { token } = useAuth();

  const [application, setApplication] = useState(null);

  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadApplication();
  }, [id]);

  const loadApplication = async () => {
    setLoading(true);

    try {
      const response = await getRecruiterApplication(id, token);

      setApplication(response.data.data);

      setStatus(response.data.data.status);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (status === application.status) {
      alert("Please select a different status.");
      return;
    }

    setUpdating(true);

    try {
      const response = await updateRecruiterApplicationStatus(
        application.id,
        status,
        token,
      );

      setApplication(response.data.data);

      setStatus(response.data.data.status);

      alert("Application status updated successfully.");
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setUpdating(false);
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
        to="/recruiter/applications"
        className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline"
      >
        ← Back to Applications
      </Link>

      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          {application.candidate.full_name}
        </h1>

        <p className="mt-2 text-slate-600">
          {application.candidate.headline || "No headline"}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Candidate Information
            </h2>

            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <span className="font-medium">Full Name:</span>{" "}
                {application.candidate.full_name}
              </p>

              <p>
                <span className="font-medium">Phone:</span>{" "}
                {application.candidate.phone || "N/A"}
              </p>

              <p>
                <span className="font-medium">City:</span>{" "}
                {application.candidate.city?.name || "N/A"}
              </p>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Job Information
            </h2>

            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <span className="font-medium">Job Title:</span>{" "}
                {application.job.title}
              </p>

              <p>
                <span className="font-medium">Company:</span>{" "}
                {application.job.company.company_name}
              </p>

              <p>
                <span className="font-medium">Employment Type:</span>{" "}
                {application.job.employment_type}
              </p>

              <p>
                <span className="font-medium">Workplace Type:</span>{" "}
                {application.job.workplace_type}
              </p>

              <p>
                <span className="font-medium">Experience Level:</span>{" "}
                {application.job.experience_level}
              </p>

              <p>
                <span className="font-medium">Job City:</span>{" "}
                {application.job.city?.name || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Cover Letter
          </h2>

          <p className="whitespace-pre-line text-slate-700">
            {application.cover_letter || "No cover letter provided."}
          </p>
        </div>

        <div className="mt-8 rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Resume</h2>

          {application.resume ? (
            <a
              href={application.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              View Resume
            </a>
          ) : (
            <p className="text-slate-600">No resume uploaded.</p>
          )}
        </div>
        <div className="mt-8 rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Application Status
          </h2>

          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Update Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleUpdateStatus}
              disabled={
                updating ||
                ["accepted", "rejected", "withdrawn"].includes(
                  application.status,
                )
              }
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating ? "Updating..." : "Update Status"}
            </button>
          </div>

          {["accepted", "rejected", "withdrawn"].includes(
            application.status,
          ) && (
            <p className="mt-3 text-sm text-red-600">
              This application can no longer be updated.
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/recruiter/applications"
            className="rounded-lg bg-slate-700 px-6 py-3 font-medium text-white transition hover:bg-slate-800"
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
