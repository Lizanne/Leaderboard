import CardShell from '../components/atoms/CardShell';
import Hero from '../components/atoms/Hero';
import UrgencyBar from '../components/atoms/UrgencyBar';
import TermsLink from '../components/atoms/TermsLink';
import PositionSection from '../components/composite/PositionSection';
import RewardsFooter from '../components/composite/RewardsFooter';

export default function OngoingInPrizesCard() {
  return (
    <CardShell>
      <Hero
        eyebrow="Easter Leaderboard"
        title={<>Hippety-hop<br />right to the top</>}
        amount="£5,000"
        subtitle="Prize pool up for grabs"
      />
      <UrgencyBar text={<><strong>5d 21h</strong> remaining</>} />
      <PositionSection
        rank={47}
        score={892}
        inPrizes={true}
        updatedText="Last updated 13 hrs ago"
      />
      <RewardsFooter title="Cash & Free Spins" hint="Top 300" status="unlocked" />
      <TermsLink />
    </CardShell>
  );
}
