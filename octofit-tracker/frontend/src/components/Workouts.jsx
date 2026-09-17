import ResourceView from './ResourceView.jsx';

export default function Workouts() {
  const endpoint = '/api/workouts/';
  return <ResourceView resource={endpoint} endpoint={endpoint} title="Workouts" description="Suggested and assigned exercise plans." fields={['title', 'category', 'difficulty', 'durationMinutes']} />;
}
