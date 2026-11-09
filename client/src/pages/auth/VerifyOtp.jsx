import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import OtpInput from "../../components/auth/OtpInput";

export default function VerifyOtp() {
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  return (
    <Card>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Verify Your Email</h1>

        <p className="mt-2 text-sm text-slate-500">
          We've sent a 6-digit verification code to
        </p>

        <p className="mt-2 font-semibold text-slate-700">
          {email || "your email"}
        </p>
      </div>

      <div className="mb-8">
        <OtpInput otp={otp} setOtp={setOtp} />
      </div>

      <Button>Verify OTP</Button>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">Didn't receive the code?</p>

        <button
          type="button"
          className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Resend OTP
        </button>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-6 text-center">
        <Link
          to="/login"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Back to Login
        </Link>
      </div>
    </Card>
  );
}
