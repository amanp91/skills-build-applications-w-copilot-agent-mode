import { useEffect, useMemo, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import logo from '../../../docs/octofitapp-small.png';
import Activities from './components/Activities.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Teams from './components/Teams.jsx';
import Users from './components/Users.jsx';
import Workouts from './components/Workouts.jsx';
import { fetchResource } from './api.js';
import './App.css';

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
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </main>
    </div>
  );
}

export default App;
