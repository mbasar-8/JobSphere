import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";

import { createCompany, getCompany, updateCompany } from "../../api/company";

import { getIndustries, getCities } from "../../api/masterData";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function Company() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [mode, setMode] = useState("create");

  const [error, setError] = useState("");

  const [errors, setErrors] = useState({});

  const [industries, setIndustries] = useState([]);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({
    industry_id: "",
    company_name: "",
    logo: "",
    website: "",
    email: "",
    phone: "",
    description: "",
    city_id: "",
    company_size: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([loadIndustries(), loadCities(), loadCompany()]);
    } finally {
      setLoading(false);
    }
  };

  const loadIndustries = async () => {
    try {
      const response = await getIndustries(token);

      setIndustries(response.data.data);
    } catch (error) {
      console.error(error);
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

  const loadCompany = async () => {
    try {
      const response = await getCompany(token);

      const company = response.data.data;

      setForm({
        industry_id: company.industry?.id || "",
        company_name: company.company_name || "",
        logo: company.logo || "",
        website: company.website || "",
        email: company.email || "",
        phone: company.phone || "",
        description: company.description || "",
        city_id: company.city?.id || "",
        company_size: company.company_size || "",
      });

      setMode("edit");
    } catch (error) {
      if (error.response?.status === 404) {
        setMode("create");
      } else {
        setError(error.response?.data?.message || "Unable to load company.");
      }
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
        await createCompany(form, token);
      } else {
        await updateCompany(form, token);
      }

      await loadCompany();

      alert(
        mode === "create"
          ? "Company created successfully."
          : "Company updated successfully.",
      );
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
        <p className="text-center">Loading company...</p>
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
        <h1 className="text-3xl font-bold text-slate-900">Company</h1>

        <p className="mt-2 text-sm text-slate-600">
          {mode === "create"
            ? "Create your company profile."
            : "Update your company information."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Industry */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Industry <span className="text-red-500">*</span>
          </label>

          <select
            name="industry_id"
            value={form.industry_id}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select Industry</option>

            {industries.map((industry) => (
              <option key={industry.id} value={industry.id}>
                {industry.name}
              </option>
            ))}
          </select>

          {errors.industry_id && (
            <p className="mt-1 text-sm text-red-600">{errors.industry_id[0]}</p>
          )}
        </div>

        <Input
          label="Company Name"
          type="text"
          name="company_name"
          value={form.company_name}
          onChange={handleChange}
          error={errors.company_name?.[0]}
        />

        <Input
          label="Website"
          type="url"
          name="website"
          value={form.website}
          onChange={handleChange}
          error={errors.website?.[0]}
        />

        <Input
          label="Company Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email?.[0]}
        />

        <Input
          label="Phone"
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone?.[0]}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Company Size
          </label>

          <select
            name="company_size"
            value={form.company_size}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select Company Size</option>
            <option value="1-10">1 - 10 Employees</option>
            <option value="11-50">11 - 50 Employees</option>
            <option value="51-200">51 - 200 Employees</option>
            <option value="201-500">201 - 500 Employees</option>
            <option value="501-1000">501 - 1000 Employees</option>
            <option value="1000+">1000+ Employees</option>
          </select>

          {errors.company_size && (
            <p className="mt-1 text-sm text-red-600">
              {errors.company_size[0]}
            </p>
          )}
        </div>

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

        <Input
          label="Logo URL"
          type="text"
          name="logo"
          value={form.logo}
          onChange={handleChange}
          error={errors.logo?.[0]}
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

        <Button type="submit" loading={submitting}>
          {mode === "create" ? "Create Company" : "Update Company"}
        </Button>
      </form>
    </Card>
  );
}
