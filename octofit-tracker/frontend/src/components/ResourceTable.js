import { useMemo, useState } from "react";

function ResourceTable({
  title,
  endpoint,
  data,
  columns,
  onRefresh,
  loading,
  error,
}) {
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredData = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return data;
    }

    return data.filter((item) => {
      const values = Object.values(item ?? {})
        .map((value) => {
          if (Array.isArray(value)) {
            return value.join(" ");
          }
          if (value && typeof value === "object") {
            return JSON.stringify(value);
          }
          return String(value ?? "");
        })
        .join(" ")
        .toLowerCase();

      return values.includes(normalizedQuery);
    });
  }, [data, query]);

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
        <h2 className="h4 mb-0">{title}</h2>
        <div className="d-flex align-items-center gap-2">
          <a
            className="link-primary"
            href={endpoint}
            target="_blank"
            rel="noreferrer"
          >
            API Endpoint
          </a>
          <button
            className="btn btn-primary btn-sm"
            type="button"
            onClick={onRefresh}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="card-body">
        <form
          className="row g-2 mb-3"
          onSubmit={(event) => {
            event.preventDefault();
            onRefresh();
          }}
        >
          <div className="col-12 col-md-8">
            <input
              className="form-control"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
            />
          </div>
          <div className="col-12 col-md-4 d-grid">
            <button className="btn btn-outline-primary" type="submit">
              Search & Refresh
            </button>
          </div>
        </form>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle mb-0">
            <thead className="table-light">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} scope="col">
                    {column.label}
                  </th>
                ))}
                <th scope="col" className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {!loading && filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="text-center text-muted"
                  >
                    No records found.
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading &&
                filteredData.map((item, index) => (
                  <tr key={item.id ?? item._id ?? `${title}-${index}`}>
                    {columns.map((column) => (
                      <td key={`${column.key}-${index}`}>
                        {column.render(item)}
                      </td>
                    ))}
                    <td className="text-center">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        type="button"
                        onClick={() => setSelectedItem(item)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedItem && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">{title} Details</h3>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedItem(null)}
                  />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">
                    {JSON.stringify(selectedItem, null, 2)}
                  </pre>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => setSelectedItem(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
}

export default ResourceTable;
