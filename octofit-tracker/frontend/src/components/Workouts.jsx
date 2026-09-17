import ResourceView from './ResourceView.jsx';

export default function Workouts() {
  return <ResourceView resource="workouts" title="Workouts" description="Suggested and assigned exercise plans." fields={['title', 'category', 'difficulty', 'durationMinutes']} />;
}
