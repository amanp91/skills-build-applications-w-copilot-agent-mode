import ResourceView from './ResourceView.jsx';

export default function Teams() {
  return <ResourceView resource="teams" title="Teams" description="Student teams and membership counts." fields={['name', 'description', 'members']} />;
}
