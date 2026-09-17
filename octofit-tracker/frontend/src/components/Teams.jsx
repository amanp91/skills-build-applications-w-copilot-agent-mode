import ResourceView from './ResourceView.jsx';

export default function Teams() {
  const endpoint = '/api/teams/';
  return <ResourceView resource={endpoint} endpoint={endpoint} title="Teams" description="Student teams and membership counts." fields={['name', 'description', 'members']} />;
}
