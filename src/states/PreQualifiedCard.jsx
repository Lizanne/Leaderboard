import CardShell from '../components/atoms/CardShell';
import Hero from '../components/atoms/Hero';
import UrgencyBar from '../components/atoms/UrgencyBar';
import TermsLink from '../components/atoms/TermsLink';
import QualifierSection from '../components/composite/QualifierSection';
import RewardsSection from '../components/composite/RewardsSection';

export default function PreQualifiedCard() {
  const qualifierRows = [
    { step: 1, title: 'Opt in', hint: 'Complete', done: true },
    { step: 2, title: 'Deposit', hint: '£0 of £20', done: false, progress: 0, action: 'Deposit' },
    { step: 3, title: 'Play', hint: '£0 of £50', done: false, progress: 0, action: 'Play now' },
  ];

  return (
    <CardShell>
      <Hero
        eyebrow="Easter Leaderboard"
        title={<>Hippety-hop<br />right to the top</>}
        amount="£5,000"
        subtitle="Prize pool up for grabs"
      />
      <UrgencyBar text={<><strong>14h 42m</strong> left to qualify</>} />
      <QualifierSection rows={qualifierRows} />
      <RewardsSection
        title="Cash & Free Spins Prizes!"
        hint="Complete all qualifiers"
        status="locked"
      />
      <TermsLink />
    </CardShell>
  );
}
