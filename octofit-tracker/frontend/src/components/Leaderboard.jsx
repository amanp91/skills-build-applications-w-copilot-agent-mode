import ResourceView from './ResourceView.jsx';

export default function Leaderboard() {
  return <ResourceView resource="leaderboard" title="Leaderboard" description="Progress ranking by points." fields={['username', 'totalPoints', 'rank', 'teamName']} />;
}
