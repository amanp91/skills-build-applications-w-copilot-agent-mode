import ResourceView from './ResourceView.jsx';

export default function Leaderboard() {
  const endpoint = import.meta.env.VITE_CODESPACE_NAME
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard`
    : '/api/leaderboard/';
  return <ResourceView resource={endpoint} endpoint={endpoint} title="Leaderboard" description="Progress ranking by points." fields={['username', 'totalPoints', 'rank', 'teamName']} />;
}
