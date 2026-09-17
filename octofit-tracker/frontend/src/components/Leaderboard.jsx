import ResourceView from './ResourceView.jsx';

export default function Leaderboard() {
  const endpoint = '/api/leaderboard/';
  return <ResourceView resource={endpoint} endpoint={endpoint} title="Leaderboard" description="Progress ranking by points." fields={['username', 'totalPoints', 'rank', 'teamName']} />;
}
