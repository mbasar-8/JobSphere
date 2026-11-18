import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getSavedJobs, removeSavedJob } from "../../api/savedJob";

import { useAuth } from "../../context/AuthContext";

export default function SavedJobs() {
  const { token } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    setLoading(true);

    try {
      const response = await getSavedJobs(token);

      setJobs(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (jobId) => {
    try {
      await removeSavedJob(jobId, token);

      setJobs((previousJobs) => previousJobs.filter((job) => job.id !== jobId));

      if (jobs.length === 1) {
        alert("No saved jobs remaining.");
      }

      alert("Job removed successfully.");
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message ?? "Something went wrong.");
    }
  };

  if (loading) {
    return <p className="text-slate-600">Loading saved jobs...</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Saved Jobs</h1>

      {jobs.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-slate-600">You haven't saved any jobs yet.</p>

          <Link
            to="/jobs"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-lg border bg-white p-5 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-800">
                {job.title}
              </h2>

              <p className="mt-1 text-slate-600">{job.company?.company_name}</p>

              <p className="mt-1 text-sm text-slate-500">{job.city?.name}</p>

              <div className="mt-4 flex flex-wrap gap-2">
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

              <div className="mt-6 flex gap-3">
                <Link
                  to={`/jobs/${job.slug}`}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                  View Details
                </Link>

                <button
                  type="button"
                  onClick={() => handleRemove(job.id)}
                  className="rounded-lg border border-red-300 px-5 py-2 text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
