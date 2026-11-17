import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { createJob, getJob, updateJob } from "../../api/jobs";

import { getCities } from "../../api/masterData";

import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function JobForm({ mode }) {
  const { token } = useAuth();

  const navigate = useNavigate();

  const { id } = useParams();

  const [loading, setLoading] = useState(mode === "edit");

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [errors, setErrors] = useState({});

  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({
    title: "",
    city_id: "",
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    employment_type: "",
    workplace_type: "",
    experience_level: "",
    salary_min: "",
    salary_max: "",
    salary_currency: "BDT",
    vacancies: 1,
    application_deadline: "",
  });

  useEffect(() => {
    loadCities();

    if (mode === "edit") {
      loadJob();
    }
  }, []);

  const loadCities = async () => {
    try {
      const response = await getCities(token);

      setCities(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadJob = async () => {
    try {
      const response = await getJob(id, token);

      const job = response.data.data;

      setForm({
        title: job.title || "",
        city_id: job.city_id || "",
        description: job.description || "",
        responsibilities: job.responsibilities || "",
        requirements: job.requirements || "",
        benefits: job.benefits || "",
        employment_type: job.employment_type || "",
        workplace_type: job.workplace_type || "",
        experience_level: job.experience_level || "",
        salary_min: job.salary_min || "",
        salary_max: job.salary_max || "",
        salary_currency: job.salary_currency || "BDT",
        vacancies: job.vacancies || 1,
        application_deadline: job.application_deadline || "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load job.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setErrors({});

    try {
      if (mode === "create") {
        await createJob(form, token);
      } else {
        await updateJob(id, form, token);
      }

      alert(
        mode === "create"
          ? "Job created successfully."
          : "Job updated successfully.",
      );

      navigate("/jobs");
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        alert(error.response?.data?.message || "Something went wrong.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <p className="text-center">Loading job...</p>
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
    <Card>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {mode === "create" ? "Create Job" : "Edit Job"}
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          {mode === "create"
            ? "Create a new job posting."
            : "Update your job posting."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Job Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          error={errors.title?.[0]}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            City
          </label>

          <select
            name="city_id"
            value={form.city_id}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select City</option>

            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>

          {errors.city_id && (
            <p className="mt-1 text-sm text-red-600">{errors.city_id[0]}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Employment Type
          </label>

          <select
            name="employment_type"
            value={form.employment_type}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select Employment Type</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="temporary">Temporary</option>
            <option value="freelance">Freelance</option>
          </select>

          {errors.employment_type && (
            <p className="mt-1 text-sm text-red-600">
              {errors.employment_type[0]}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Workplace Type
          </label>

          <select
            name="workplace_type"
            value={form.workplace_type}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select Workplace Type</option>
            <option value="onsite">On-site</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>

          {errors.workplace_type && (
            <p className="mt-1 text-sm text-red-600">
              {errors.workplace_type[0]}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Experience Level
          </label>

          <select
            name="experience_level"
            value={form.experience_level}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select Experience Level</option>
            <option value="entry">Entry</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>

          {errors.experience_level && (
            <p className="mt-1 text-sm text-red-600">
              {errors.experience_level[0]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label="Minimum Salary"
            type="number"
            name="salary_min"
            value={form.salary_min}
            onChange={handleChange}
            error={errors.salary_min?.[0]}
          />

          <Input
            label="Maximum Salary"
            type="number"
            name="salary_max"
            value={form.salary_max}
            onChange={handleChange}
            error={errors.salary_max?.[0]}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label="Salary Currency"
            name="salary_currency"
            value={form.salary_currency}
            onChange={handleChange}
            error={errors.salary_currency?.[0]}
          />

          <Input
            label="Vacancies"
            type="number"
            name="vacancies"
            value={form.vacancies}
            onChange={handleChange}
            error={errors.vacancies?.[0]}
          />
        </div>

        <Input
          label="Application Deadline"
          type="date"
          name="application_deadline"
          value={form.application_deadline}
          onChange={handleChange}
          error={errors.application_deadline?.[0]}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Responsibilities
          </label>

          <textarea
            name="responsibilities"
            rows={5}
            value={form.responsibilities}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />

          {errors.responsibilities && (
            <p className="mt-1 text-sm text-red-600">
              {errors.responsibilities[0]}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Requirements
          </label>

          <textarea
            name="requirements"
            rows={5}
            value={form.requirements}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />

          {errors.requirements && (
            <p className="mt-1 text-sm text-red-600">
              {errors.requirements[0]}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Benefits
          </label>

          <textarea
            name="benefits"
            rows={5}
            value={form.benefits}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />

          {errors.benefits && (
            <p className="mt-1 text-sm text-red-600">{errors.benefits[0]}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={submitting}>
            {mode === "create" ? "Create Job" : "Update Job"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
