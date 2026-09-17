import ResourceView from './ResourceView.jsx';

export default function Teams() {
  const endpoint = import.meta.env.VITE_CODESPACE_NAME
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams`
    : '/api/teams/';
  return <ResourceView resource={endpoint} endpoint={endpoint} title="Teams" description="Student teams and membership counts." fields={['name', 'description', 'members']} />;
}
