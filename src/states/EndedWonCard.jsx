import CardShell from '../components/atoms/CardShell';
import Hero from '../components/atoms/Hero';
import UrgencyBar from '../components/atoms/UrgencyBar';
import TermsLink from '../components/atoms/TermsLink';
import CTAButton from '../components/atoms/CTAButton';
import PrizeSection from '../components/composite/PrizeSection';

export default function EndedWonCard() {
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
      <PrizeSection
        amount="£10"
        type="Cash prize"
        rank={47}
        score={892}
      />
      <div className="px-[var(--spacing-card-x)] pb-1">
        <CTAButton label="View promotions" icon="chevron" variant="dark" />
      </div>
      <TermsLink />
    </CardShell>
  );
}
