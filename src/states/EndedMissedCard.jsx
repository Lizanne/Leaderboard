import CardShell from '../components/atoms/CardShell';
import Hero from '../components/atoms/Hero';
import UrgencyBar from '../components/atoms/UrgencyBar';
import TermsLink from '../components/atoms/TermsLink';
import CTAButton from '../components/atoms/CTAButton';
import ResultSection from '../components/composite/ResultSection';
import RewardsFooter from '../components/composite/RewardsFooter';

export default function EndedMissedCard() {
  return (
    <CardShell>
      <Hero
        eyebrow="Easter Leaderboard"
        title={<>Hippety-hop<br />right to the top</>}
        amount="£5,000"
        subtitle="Prize pool up for grabs"
        ended
      />
      <UrgencyBar ended />
      <ResultSection
        rank={301}
        score={254}
        contextLine="300th place finished 5 pts ahead of you"
      />
      <div className="px-[var(--spacing-card-x)] pb-1">
        <CTAButton label="View promotions" icon="chevron" variant="dark" />
      </div>
      <RewardsFooter title="Cash & Free Spins" hint="Top 300" status="not-won" />
      <TermsLink />
    </CardShell>
  );
}
