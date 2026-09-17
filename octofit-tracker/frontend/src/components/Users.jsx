import ResourceView from './ResourceView.jsx';

export default function Users() {
  return <ResourceView resource="users" title="Users" description="Registered students and fitness profiles." fields={['username', 'email', 'fitnessLevel', 'team']} />;
}
