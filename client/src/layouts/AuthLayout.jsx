import { Outlet } from "react-router-dom";

import logo from "../assets/images/logo.svg";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <img src={logo} alt="JobSphere" className="h-14 w-auto" />
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
