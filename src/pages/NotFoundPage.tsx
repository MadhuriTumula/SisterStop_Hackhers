import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import EmptyState from "../components/EmptyState";

const NotFoundPage = () => (
  <EmptyState
    icon={Compass}
    title="That screen does not exist"
    description="The link may be out of date. Everything in SisterStop is reachable from the trip planner or the Safety Hub."
  >
    <Link to="/plan" className="btn-primary">
      Plan a trip
    </Link>
    <Link to="/safety" className="btn-secondary">
      Safety Hub
    </Link>
  </EmptyState>
);

export default NotFoundPage;
