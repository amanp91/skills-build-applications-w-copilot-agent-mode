import ResourceView from './ResourceView.jsx';

export default function Workouts() {
  const endpoint = import.meta.env.VITE_CODESPACE_NAME
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/workouts`
    : '/api/workouts/';
  return <ResourceView resource={endpoint} endpoint={endpoint} title="Workouts" description="Suggested and assigned exercise plans." fields={['title', 'category', 'difficulty', 'durationMinutes']} />;
}
