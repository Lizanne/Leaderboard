import CardShell from '../components/atoms/CardShell';
import Hero from '../components/atoms/Hero';
import UrgencyBar from '../components/atoms/UrgencyBar';
import TermsLink from '../components/atoms/TermsLink';
import QualifiedRow from '../components/composite/QualifiedRow';
import PositionSection from '../components/composite/PositionSection';
import RewardsSection from '../components/composite/RewardsSection';

export default function JustQualifiedCard() {
  return (
    <CardShell>
      <Hero
        eyebrow="Easter Leaderboard"
        title={<>Hippety-hop<br />right to the top</>}
        amount="£5,000"
        subtitle="Prize pool up for grabs"
      />
      <UrgencyBar text={<><strong>5d 21h</strong> remaining</>} />
      <QualifiedRow />
      <PositionSection
        rank={314}
        score={892}
        inPrizes={false}
        contextLine="5 pts behind 300th place"
        updatedText="Last updated 13 hrs ago"
      />
      <RewardsSection
        title="Cash & Free Spins Prizes!"
        hint="Reach the top 300 to unlock"
        status="locked"
      />
      <TermsLink />
    </CardShell>
  );
}
