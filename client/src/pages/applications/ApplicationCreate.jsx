import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getPublicJob } from "../../api/publicJob";
import { applyJob, checkApplication } from "../../api/application";

import { useAuth } from "../../context/AuthContext";

export default function ApplicationCreate() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { token, user } = useAuth();

  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(true);

  const [applied, setApplied] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    cover_letter: "",
    resume: "",
  });

  useEffect(() => {
    loadJob();
  }, [slug]);

  const loadJob = async () => {
    setLoading(true);

    try {
      const response = await getPublicJob(slug);

      const jobData = response.data.data;

      setJob(jobData);

      if (token && user?.role === "candidate") {
        const status = await checkApplication(jobData.id, token);

        setApplied(status.data.data.applied);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);

    try {
      await applyJob(
        {
          job_id: job.id,
          cover_letter: form.cover_letter,
          resume: form.resume,
        },
        token,
      );

      alert("Application submitted successfully.");

      navigate("/applications");
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-slate-600">Loading...</p>;
  }

  if (!job) {
    return <div className="rounded-lg border bg-white p-6">Job not found.</div>;
  }

  if (applied) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Already Applied</h1>

          <p className="mt-3 text-slate-600">
            You have already applied for this job.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/applications"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              View My Applications
            </Link>

            <Link
              to={`/jobs/${job.slug}`}
              className="rounded-lg border border-slate-300 px-6 py-3 font-medium hover:bg-slate-100"
            >
              Back to Job
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to={`/jobs/${job.slug}`}
        className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline"
      >
        ← Back to Job
      </Link>

      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          Apply for this Job
        </h1>

        <div className="mt-8 rounded-lg border bg-slate-50 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">{job.title}</h2>

          <p className="mt-2 text-slate-600">{job.company?.company_name}</p>

          <p className="mt-1 text-sm text-slate-500">{job.city?.name}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded bg-blue-100 px-3 py-1 text-sm">
              {job.employment_type}
            </span>

            <span className="rounded bg-green-100 px-3 py-1 text-sm">
              {job.workplace_type}
            </span>

            <span className="rounded bg-purple-100 px-3 py-1 text-sm">
              {job.experience_level}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Cover Letter
            </label>

            <textarea
              name="cover_letter"
              value={form.cover_letter}
              onChange={handleChange}
              rows={8}
              placeholder="Write your cover letter..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Resume
            </label>

            <input
              type="text"
              name="resume"
              value={form.resume}
              onChange={handleChange}
              placeholder="Resume URL or filename"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>

            <Link
              to={`/jobs/${job.slug}`}
              className="rounded-lg border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
