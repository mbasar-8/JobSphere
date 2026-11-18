import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getPublicJobs } from "../../api/publicJob";
import { getCities } from "../../api/city";
import { useAuth } from "../../context/AuthContext";

export default function PublicJobs() {
  const { token } = useAuth();

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [cities, setCities] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [cityId, setCityId] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [workplaceType, setWorkplaceType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [sort, setSort] = useState("latest");

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    loadCities();
  }, []);

  useEffect(() => {
    loadJobs();
  }, [currentPage]);

  const loadJobs = async (page = currentPage) => {
    setLoading(true);

    try {
      const response = await getPublicJobs({
        search,
        city_id: cityId,
        employment_type: employmentType,
        workplace_type: workplaceType,
        experience_level: experienceLevel,
        sort,
        page,
      });

      setJobs(response.data.data);

      setCurrentPage(response.data.meta.current_page);
      setLastPage(response.data.meta.last_page);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCities = async () => {
    try {
      const response = await getCities(token);

      setCities(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const applyFilters = () => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      loadJobs(1);
    }
  };

  const changePage = (page) => {
    if (page < 1 || page > lastPage) {
      return;
    }

    setCurrentPage(page);
  };

  if (loading) {
    return <p className="text-slate-600">Loading jobs...</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Browse Jobs</h1>

      <div className="mb-6 space-y-4 rounded-lg border bg-white p-5">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              applyFilters();
            }
          }}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />

        <select
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3"
        >
          <option value="">All Cities</option>

          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>

        <select
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3"
        >
          <option value="">All Employment Types</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>

        <select
          value={workplaceType}
          onChange={(e) => setWorkplaceType(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3"
        >
          <option value="">All Workplace Types</option>
          <option value="on-site">On Site</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <select
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3"
        >
          <option value="">All Experience Levels</option>
          <option value="entry">Entry</option>
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>

        <button
          onClick={applyFilters}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-center">
          No jobs found.
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/jobs/${job.slug}`)}
              className="cursor-pointer rounded-lg border bg-white p-5 shadow-sm transition hover:border-blue-500 hover:shadow-md"
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
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          disabled={currentPage === 1}
          onClick={() => changePage(currentPage - 1)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm font-medium text-slate-600">
          Page {currentPage} of {lastPage}
        </span>

        <button
          disabled={currentPage === lastPage}
          onClick={() => changePage(currentPage + 1)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
