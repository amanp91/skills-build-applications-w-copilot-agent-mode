import { useEffect, useState } from 'react';
import { fetchResource } from '../api.js';

function ResourceTable({ title, description, data, fields }) {
  if (!data.length) {
    return (
      <section className="panel">
        <h2>{title}</h2>
        <p className="text-muted">{description}</p>
        <div className="empty-state">No records yet.</div>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>{title}</h2>
      <p className="text-muted">{description}</p>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              {fields.map((field) => <th key={field}>{field}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const key = item._id || `${title}-${index}`;
              return (
                <tr key={key}>
                  {fields.map((field) => <td key={`${key}-${field}`}>{item[field] ?? '—'}</td>)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function ResourceView({ resource, endpoint, title, description, fields }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetchResource(endpoint || resource)
      .then((records) => {
        if (active) setData(records);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [endpoint, resource]);

  return (
    <div>
      <div className="page-header mb-4">
        <div><p className="eyebrow">Resource</p><h1>{title}</h1></div>
      </div>
      {error ? <div className="alert alert-danger">{error}</div> : null}
      {loading ? <div className="empty-state">Loading {title.toLowerCase()}…</div> : (
        <ResourceTable title={title} description={description} data={data} fields={fields} />
      )}
    </div>
  );
}
