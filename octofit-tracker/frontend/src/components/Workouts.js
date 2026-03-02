import { useEffect, useState } from "react";
import ResourceTable from "./ResourceTable";

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
  : "http://localhost:8000/api/workouts/";

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const columns = [
    {
      key: "name",
      label: "Workout",
      render: (workout) => workout.name ?? "-",
    },
    {
      key: "suggested_for",
      label: "Suggested For",
      render: (workout) => workout.suggested_for ?? "-",
    },
    {
      key: "description",
      label: "Description",
      render: (workout) => workout.description ?? "-",
    },
  ];

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("[Workouts] REST API endpoint:", endpoint);
      const response = await fetch(endpoint);
      const payload = await response.json();
      const normalized = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.results)
          ? payload.results
          : [];

      console.log("[Workouts] fetched data:", payload);
      setWorkouts(normalized);
    } catch (fetchError) {
      console.error("[Workouts] fetch error:", fetchError);
      setError("Unable to load workouts from the API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  return (
    <section>
      <ResourceTable
        title="Workouts"
        endpoint={endpoint}
        data={workouts}
        columns={columns}
        onRefresh={loadWorkouts}
        loading={loading}
        error={error}
      />
    </section>
  );
}

export default Workouts;
