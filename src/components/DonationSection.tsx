import { Button } from "@/components/ui/button";

const PAYPAL_DONATION_URL = "https://www.paypal.com/ncp/payment/5W63FHZLYAUY2";

export function DonationSection() {
  return (
    <section
      id="donate"
      className="scroll-mt-28 bg-primary px-6 py-14 text-primary-foreground"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold uppercase">Support the work</p>
        <h2 className="mt-3 font-display text-3xl font-semibold">
          Support HELPS Counsellors
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed">
          Your support helps us make relationship and family support more
          accessible. You will choose your amount securely on PayPal.
        </p>
        <a href={PAYPAL_DONATION_URL} target="_blank" rel="noreferrer">
          <Button variant="secondary" size="lg" className="mt-6">
            Donate with PayPal
          </Button>
        </a>
      </div>
    </section>
  );
}
