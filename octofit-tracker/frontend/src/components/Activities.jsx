import ResourceView from './ResourceView.jsx';

export default function Activities() {
  return <ResourceView resource="activities" title="Activities" description="Recent workout and exercise logs." fields={['type', 'durationMinutes', 'caloriesBurned', 'date']} />;
}
