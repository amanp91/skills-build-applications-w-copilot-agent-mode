import ResourceView from './ResourceView.jsx';

export default function Activities() {
  const endpoint = import.meta.env.VITE_CODESPACE_NAME
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities`
    : '/api/activities/';
  return <ResourceView resource={endpoint} endpoint={endpoint} title="Activities" description="Recent workout and exercise logs." fields={['type', 'durationMinutes', 'caloriesBurned', 'date']} />;
}
