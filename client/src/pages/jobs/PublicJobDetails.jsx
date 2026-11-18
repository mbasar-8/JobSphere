import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getPublicJob } from "../../api/publicJob";
import { checkSavedJob, saveJob, removeSavedJob } from "../../api/savedJob";
import { useAuth } from "../../context/AuthContext";

export default function PublicJobDetails() {
  const { slug } = useParams();
  const { token, user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadJob();
  }, [slug]);

  useEffect(() => {
    if (job) {
      loadSavedStatus();
    }
  }, [job]);

  const loadJob = async () => {
    setLoading(true);

    try {
      const response = await getPublicJob(slug);

      setJob(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedStatus = async () => {
    if (!token) return;

    if (user?.role !== "candidate") return;

    try {
      const response = await checkSavedJob(job.id, token);

      setSaved(response.data.data.saved);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveJob = async () => {
    if (!token) {
      alert("Please login first.");
      return;
    }

    if (user?.role !== "candidate") {
      alert("Only candidates can save jobs.");
      return;
    }

    if (saving) return;

    setSaving(true);

    try {
      if (saved) {
        await removeSavedJob(job.id, token);

        setSaved(false);

        alert("Job removed from saved jobs.");
      } else {
        await saveJob(job.id, token);

        setSaved(true);

        alert("Job saved successfully.");
      }
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-600">Loading job...</p>;
  }

  if (!job) {
    return <div className="rounded-lg border bg-white p-6">Job not found.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/jobs"
        className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline"
      >
        ← Back to Jobs
      </Link>

      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>

        <p className="mt-2 text-lg text-slate-600">
          {job.company?.company_name}
        </p>

        <p className="mt-1 text-sm text-slate-500">{job.city?.name}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded bg-blue-100 px-3 py-1 text-sm">
            {job.employment_type}
          </span>

          <span className="rounded bg-green-100 px-3 py-1 text-sm">
            {job.workplace_type}
          </span>

          <span className="rounded bg-purple-100 px-3 py-1 text-sm">
            {job.experience_level}
          </span>

          <span className="rounded bg-amber-100 px-3 py-1 text-sm">
            {job.salary_type}
          </span>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-2 text-lg font-semibold">Job Description</h2>

            <p className="whitespace-pre-line text-slate-700">
              {job.description}
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">Requirements</h2>

            <p className="whitespace-pre-line text-slate-700">
              {job.requirements}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 border-t pt-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-slate-500">Salary</p>

            <p className="font-semibold">
              {job.salary_min} - {job.salary_max} {job.salary_currency}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Vacancies</p>

            <p className="font-semibold">{job.vacancies}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Deadline</p>

            <p className="font-semibold">{job.application_deadline}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Published</p>

            <p className="font-semibold">{job.published_at}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to={`/applications/create/${job.slug}`}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Apply Now
          </Link>

          {user?.role === "candidate" && (
            <button
              type="button"
              onClick={handleSaveJob}
              disabled={saving}
              className="rounded-lg border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Please wait..." : saved ? "Saved ✓" : "Save Job"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
