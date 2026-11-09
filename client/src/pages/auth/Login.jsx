import { useState } from "react";
import { Link } from "react-router-dom";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { login } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login: loginUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // Clear error while typing
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!formData.email.trim()) {
      validationErrors.email = "Email is required.";
    }

    if (!formData.password.trim()) {
      validationErrors.password = "Password is required.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await login(formData);

      const { token, user } = response.data.data;

      loginUser(token, user);

      console.log("Login successful");
      console.log(response.data);
    } catch (error) {
      console.error(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>

        <p className="mt-2 text-sm text-slate-500">
          Sign in to continue to JobSphere.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
          required
        />

        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            Forgot Password?
          </button>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Login"}
        </Button>
      </form>

      <div className="mt-6 border-t border-slate-200 pt-6 text-center">
        <p className="text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Register
          </Link>
        </p>
      </div>
    </Card>
  );
}
