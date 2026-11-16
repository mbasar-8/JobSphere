import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";

import {
  createCandidateProfile,
  getCandidateProfile,
  getRecruiterProfile,
  updateCandidateProfile,
  createRecruiterProfile,
  updateRecruiterProfile,
} from "../../api/profile";

import Card from "../../components/ui/Card";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function Profile() {
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("create");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    headline: "",
    about: "",
    gender: "",
    date_of_birth: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    designation: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {
      let response;

      if (user.role === "candidate") {
        response = await getCandidateProfile(token);
      } else {
        response = await getRecruiterProfile(token);
      }

      setProfile(response.data.data);
      setForm({
        full_name: response.data.data.full_name || "",
        phone: response.data.data.phone || "",
        headline: response.data.data.headline || "",
        about: response.data.data.about || "",
        gender: response.data.data.gender || "",
        date_of_birth: response.data.data.date_of_birth || "",
        linkedin_url: response.data.data.linkedin_url || "",
        github_url: response.data.data.github_url || "",
        portfolio_url: response.data.data.portfolio_url || "",
        designation: response.data.data.designation || "",
      });
      setMode("edit");
    } catch (error) {
      if (error.response?.status === 404) {
        setMode("create");
      } else {
        setError(error.response?.data?.message || "Unable to load profile.");
      }
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
      if (user.role === "candidate") {
        if (mode === "create") {
          await createCandidateProfile(form, token);
        } else {
          await updateCandidateProfile(form, token);
        }
      } else {
        if (mode === "create") {
          await createRecruiterProfile(form, token);
        } else {
          await updateRecruiterProfile(form, token);
        }
      }

      await loadProfile();

      alert(
        mode === "create"
          ? "Profile created successfully."
          : "Profile updated successfully.",
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
        <p className="text-center">Loading profile...</p>
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
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>

        <p className="mt-2 text-sm text-slate-600">
          {mode === "create"
            ? "Complete your profile to continue using JobSphere."
            : "Update your profile information."}
        </p>
      </div>

      {user.role === "candidate" ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            error={errors.full_name?.[0]}
          />

          <Input
            label="Phone"
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone?.[0]}
          />

          <Input
            label="Professional Headline"
            type="text"
            name="headline"
            value={form.headline}
            onChange={handleChange}
            error={errors.headline?.[0]}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              About
            </label>

            <textarea
              name="about"
              rows={5}
              value={form.about}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <Button type="submit" loading={submitting}>
            {mode === "create" ? "Create Profile" : "Update Profile"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            error={errors.full_name?.[0]}
          />

          <Input
            label="Phone"
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone?.[0]}
          />

          <Input
            label="Designation"
            type="text"
            name="designation"
            value={form.designation || ""}
            onChange={handleChange}
            error={errors.designation?.[0]}
          />

          <Button type="submit" loading={submitting}>
            {mode === "create" ? "Create Profile" : "Update Profile"}
          </Button>
        </form>
      )}
    </Card>
  );
}
