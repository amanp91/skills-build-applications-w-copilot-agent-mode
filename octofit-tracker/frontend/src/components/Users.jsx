import ResourceView from './ResourceView.jsx';

export default function Users() {
  const endpoint = import.meta.env.VITE_CODESPACE_NAME
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users`
    : '/api/users/';
  return <ResourceView resource={endpoint} endpoint={endpoint} title="Users" description="Registered students and fitness profiles." fields={['username', 'email', 'fitnessLevel', 'team']} />;
}
