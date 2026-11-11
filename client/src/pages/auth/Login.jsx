import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

import { login } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

export default function Login() {
  const { login: loginUser } = useAuth();
  const location = useLocation();

  const successMessage = location.state?.message || "";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [error, setError] = useState("");

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

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setErrors({});
    setError("");

    try {
      const response = await login(form);

      loginUser(response.data.data.token, response.data.data.user);
    } catch (error) {
      if (error.response?.status === 422) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          setError(error.response.data.message);
        }
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>

        <p className="mt-2 text-sm text-slate-600">
          Sign in to your JobSphere account.
        </p>
      </div>

      {successMessage && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

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

        <Button type="submit" loading={loading}>
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Create Account
        </Link>
      </p>
    </Card>
  );
}
