import RewardRow from '../atoms/RewardRow';

export default function RewardsFooter({ title = 'Cash & Free Spins Prizes!', status = 'locked' }) {
  return <RewardRow icon="🎰" title={title} status={status} compact />;
}
