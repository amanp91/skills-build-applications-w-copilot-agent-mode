import ResourceView from './ResourceView.jsx';

export default function Users() {
  const endpoint = '/api/users/';
  return <ResourceView resource={endpoint} endpoint={endpoint} title="Users" description="Registered students and fitness profiles." fields={['username', 'email', 'fitnessLevel', 'team']} />;
}
