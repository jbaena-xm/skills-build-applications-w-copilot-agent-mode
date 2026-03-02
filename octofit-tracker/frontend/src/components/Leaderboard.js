import { useEffect, useState } from "react";
import ResourceTable from "./ResourceTable";

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
  : "http://localhost:8000/api/leaderboard/";

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const columns = [
    {
      key: "team",
      label: "Team",
      render: (entry) => entry.team_name ?? entry.team ?? "-",
    },
    {
      key: "score",
      label: "Score",
      render: (entry) => entry.score ?? 0,
    },
    {
      key: "updated_at",
      label: "Updated",
      render: (entry) => entry.updated_at ?? "-",
    },
  ];

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("[Leaderboard] REST API endpoint:", endpoint);
      const response = await fetch(endpoint);
      const payload = await response.json();
      const normalized = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.results)
          ? payload.results
          : [];

      console.log("[Leaderboard] fetched data:", payload);
      setEntries(normalized);
    } catch (fetchError) {
      console.error("[Leaderboard] fetch error:", fetchError);
      setError("Unable to load leaderboard from the API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  return (
    <section>
      <ResourceTable
        title="Leaderboard"
        endpoint={endpoint}
        data={entries}
        columns={columns}
        onRefresh={loadLeaderboard}
        loading={loading}
        error={error}
      />
    </section>
  );
}

export default Leaderboard;
