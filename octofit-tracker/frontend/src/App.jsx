import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import logo from '../../../docs/octofitapp-small.png';
import './App.css';

const getApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:8000';
  }

  const hostname = window.location.hostname;
  if (hostname.includes('app.github.dev')) {
    return `https://${hostname.replace('-5173', '-8000')}`;
  }

  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
};

const apiBaseUrl = getApiBaseUrl();

async function fetchResource(resource) {
  const response = await fetch(`${apiBaseUrl}/api/${resource}`);
  if (!response.ok) {
    throw new Error(`Failed to load ${resource}`);
  }

  return response.json();
}

function useResource(resource) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetchResource(resource)
      .then((result) => {
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(loadError.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [resource]);

  return { data, loading, error };
}

function OverviewCard({ title, value, accent }) {
  return (
    <div className="card dashboard-card shadow-sm border-0 h-100">
      <div className="card-body">
        <div className={`stat-badge ${accent}`}>{title}</div>
        <h3>{value}</h3>
      </div>
    </div>
  );
}

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
              {fields.map((field) => (
                <th key={field} scope="col">
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item._id || `${title}-${index}`}>
                {fields.map((field) => (
                  <td key={`${item._id || `${title}-${index}`}-${field}`}>
                    {item[field] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DashboardPage() {
  const { data: users, loading: userLoading } = useResource('users');
  const { data: teams, loading: teamLoading } = useResource('teams');
  const { data: activities, loading: activityLoading } = useResource('activities');
  const { data: workouts, loading: workoutLoading } = useResource('workouts');

  const stats = useMemo(
    () => [
      { title: 'Users', value: users.length, accent: 'purple' },
      { title: 'Teams', value: teams.length, accent: 'blue' },
      { title: 'Activities', value: activities.length, accent: 'green' },
      { title: 'Workouts', value: workouts.length, accent: 'orange' },
    ],
    [activities.length, teams.length, users.length, workouts.length]
  );

  const latestActivities = activities.slice(0, 5);

  return (
    <div>
      <div className="page-header mb-4">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>OctoFit Tracker</h1>
        </div>
        <span className="live-pill">API online</span>
      </div>

      <div className="row g-3 mb-4">
        {stats.map((stat) => (
          <div key={stat.title} className="col-md-3 col-sm-6">
            <OverviewCard {...stat} />
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <section className="panel">
            <h2>Recent activity</h2>
            <p className="text-muted">The latest logged workouts and activity entries.</p>
            {userLoading || teamLoading || activityLoading || workoutLoading ? (
              <div className="empty-state">Loading data…</div>
            ) : (
              <div className="list-group list-group-flush">
                {latestActivities.map((activity) => (
                  <div className="list-group-item" key={activity._id || activity.date}>
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>{activity.type}</strong>
                      <span className="badge text-bg-light">{activity.durationMinutes} min</span>
                    </div>
                    <small className="text-muted">
                      {new Date(activity.date).toLocaleDateString()} • {activity.caloriesBurned} kcal
                    </small>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="col-lg-4">
          <section className="panel">
            <h2>Team snapshot</h2>
            <p className="text-muted">Current group participation.</p>
            <ul className="bullet-list">
              {teams.slice(0, 5).map((team) => (
                <li key={team._id || team.name}>
                  <strong>{team.name}</strong>
                  <span>{team.members?.length || 0} members</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function ResourcePage({ resource, title, description, fields }) {
  const { data, loading, error } = useResource(resource);

  return (
    <div>
      <div className="page-header mb-4">
        <div>
          <p className="eyebrow">Resource</p>
          <h1>{title}</h1>
        </div>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      {loading ? (
        <div className="empty-state">Loading {title.toLowerCase()}…</div>
      ) : (
        <ResourceTable title={title} description={description} data={data} fields={fields} />
      )}
    </div>
  );
}

function App() {
  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/users', label: 'Users' },
    { to: '/teams', label: 'Teams' },
    { to: '/activities', label: 'Activities' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/workouts', label: 'Workouts' },
  ];

  return (
    <BrowserRouter>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand-row">
            <img src={logo} alt="OctoFit Tracker logo" className="brand-logo" />
            <div>
              <strong>OctoFit</strong>
              <small>Tracker</small>
            </div>
          </div>

          <nav className="nav flex-column gap-2 mt-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="content-panel">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route
              path="/users"
              element={<ResourcePage resource="users" title="Users" description="Registered students and fitness profiles." fields={['username', 'email', 'fitnessLevel', 'team']} />}
            />
            <Route
              path="/teams"
              element={<ResourcePage resource="teams" title="Teams" description="Student teams and membership counts." fields={['name', 'description', 'members']} />}
            />
            <Route
              path="/activities"
              element={<ResourcePage resource="activities" title="Activities" description="Recent workout and exercise logs." fields={['type', 'durationMinutes', 'caloriesBurned', 'date']} />}
            />
            <Route
              path="/leaderboard"
              element={<ResourcePage resource="leaderboard" title="Leaderboard" description="Progress ranking by points." fields={['username', 'totalPoints', 'rank', 'teamName']} />}
            />
            <Route
              path="/workouts"
              element={<ResourcePage resource="workouts" title="Workouts" description="Suggested and assigned exercise plans." fields={['title', 'category', 'difficulty', 'durationMinutes']} />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
