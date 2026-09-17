import ResourceView from './ResourceView.jsx';

export default function Activities() {
  const endpoint = '/api/activities/';
  return <ResourceView resource={endpoint} endpoint={endpoint} title="Activities" description="Recent workout and exercise logs." fields={['type', 'durationMinutes', 'caloriesBurned', 'date']} />;
}
