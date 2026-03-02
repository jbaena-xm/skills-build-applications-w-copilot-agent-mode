import { useEffect, useState } from "react";
import ResourceTable from "./ResourceTable";

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
  : "http://localhost:8000/api/activities/";

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const columns = [
    {
      key: "type",
      label: "Type",
      render: (activity) => activity.type ?? "-",
    },
    {
      key: "duration",
      label: "Duration (min)",
      render: (activity) => activity.duration ?? 0,
    },
    {
      key: "calories",
      label: "Calories",
      render: (activity) => activity.calories ?? 0,
    },
    {
      key: "date",
      label: "Date",
      render: (activity) => activity.date ?? "-",
    },
  ];

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("[Activities] REST API endpoint:", endpoint);
      const response = await fetch(endpoint);
      const payload = await response.json();
      const normalized = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.results)
          ? payload.results
          : [];

      console.log("[Activities] fetched data:", payload);
      setActivities(normalized);
    } catch (fetchError) {
      console.error("[Activities] fetch error:", fetchError);
      setError("Unable to load activities from the API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  return (
    <section>
      <ResourceTable
        title="Activities"
        endpoint={endpoint}
        data={activities}
        columns={columns}
        onRefresh={loadActivities}
        loading={loading}
        error={error}
      />
    </section>
  );
}

export default Activities;
