import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../../api/auth";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    role: "candidate",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    setErrors({});

    try {
      const response = await register(form);

      navigate("/verify-otp", {
        state: {
          email: response.data.data.user.email,
        },
      });
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        alert(
          error.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>

        <p className="mt-2 text-sm text-slate-600">
          Create your JobSphere account to get started.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          error={errors.email?.[0]}
          required
          disabled={loading}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password?.[0]}
          required
          disabled={loading}
        />

        <Input
          label="Confirm Password"
          type="password"
          name="password_confirmation"
          value={form.password_confirmation}
          onChange={handleChange}
          placeholder="Confirm your password"
          error={errors.password_confirmation?.[0]}
          required
          disabled={loading}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Account Type
          </label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>

          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role[0]}</p>
          )}
        </div>

        <Button type="submit" loading={loading}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Sign In
        </Link>
      </p>
    </Card>
  );
}
