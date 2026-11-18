import Jobs from "./Jobs";
import PublicJobs from "./PublicJobs";

import { useAuth } from "../../context/AuthContext";

export default function JobsRouter() {
  const { user } = useAuth();

  if (user?.role === "recruiter") {
    return <Jobs />;
  }

  return <PublicJobs />;
}
