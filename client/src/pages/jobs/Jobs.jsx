import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { getJobs, publishJob, closeJob } from "../../api/jobs";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function Jobs() {
  const { token } = useAuth();

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getJobs(token);

      setJobs(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id) => {
    setProcessingId(id);

    try {
      await publishJob(id, token);

      await loadJobs();

      alert("Job published successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to publish job.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleClose = async (id) => {
    setProcessingId(id);

    try {
      await closeJob(id, token);

      await loadJobs();

      alert("Job closed successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to close job.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <p className="text-center">Loading jobs...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-center text-red-600">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Jobs</h1>

          <p className="mt-2 text-sm text-slate-600">
            Manage your job postings.
          </p>
        </div>

        <Link to="/jobs/create">
          <Button>Create Job</Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <div className="py-12 text-center">
            <h2 className="text-xl font-semibold text-slate-800">
              No jobs found
            </h2>

            <p className="mt-2 text-slate-600">
              Create your first job posting to start hiring candidates.
            </p>

            <div className="mt-6">
              <Link to="/jobs/create">
                <Button>Create Job</Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {job.title}
                  </h2>

                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600">
                    <span>
                      Status: <strong>{job.status}</strong>
                    </span>

                    <span>•</span>

                    <span>{job.employment_type}</span>

                    <span>•</span>

                    <span>{job.workplace_type}</span>

                    {job.application_deadline && (
                      <>
                        <span>•</span>

                        <span>Deadline: {job.application_deadline}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link to={`/jobs/${job.id}/edit`}>
                    <Button>Edit</Button>
                  </Link>

                  {job.status === "draft" && (
                    <Button
                      onClick={() => handlePublish(job.id)}
                      loading={processingId === job.id}
                    >
                      Publish
                    </Button>
                  )}

                  {job.status === "published" && (
                    <Button
                      onClick={() => handleClose(job.id)}
                      loading={processingId === job.id}
                    >
                      Close
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
