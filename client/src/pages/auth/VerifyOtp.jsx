import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { resendOtp, verifyOtp } from "../../api/auth";

import OtpInput from "../../components/auth/OtpInput";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      await verifyOtp({
        email,
        otp,
      });

      navigate("/login", {
        replace: true,
        state: {
          message: "Email verified successfully. Please sign in.",
        },
      });
    } catch (error) {
      if (error.response?.data?.errors?.otp) {
        setError(error.response.data.errors.otp[0]);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResending(true);

    try {
      await resendOtp({
        email,
      });

      alert("A new OTP has been sent successfully.");
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to resend OTP.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <Card>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Verify Your Email</h1>

        <p className="mt-2 text-sm text-slate-600">
          Enter the 6-digit verification code sent to
        </p>

        <p className="mt-1 font-medium text-slate-900">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <OtpInput value={otp} onChange={setOtp} disabled={loading} />

        {error && <p className="text-center text-sm text-red-600">{error}</p>}

        <Button type="submit" loading={loading}>
          Verify Email
        </Button>
      </form>

      <div className="mt-6 space-y-3 text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-60"
        >
          {resending ? "Sending..." : "Resend OTP"}
        </button>

        <p className="text-sm text-slate-600">
          Already verified?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Sign In
          </Link>
        </p>
      </div>
    </Card>
  );
}
