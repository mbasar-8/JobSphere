import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getPublicJob } from "../../api/publicJob";

export default function PublicJobDetails() {
  const { slug } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJob();
  }, [slug]);

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

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Salary</p>

            <p className="font-medium">
              {job.salary_min} - {job.salary_max}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Deadline</p>

            <p className="font-medium">{job.application_deadline}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Published</p>

            <p className="font-medium">{job.published_at}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Company</p>

            <p className="font-medium">{job.company?.company_name}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 border-t pt-6 md:grid-cols-3">
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
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <button className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700">
            Apply Now
          </button>

          <button className="rounded-lg border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100">
            Save Job
          </button>
        </div>
      </div>
    </div>
  );
}
