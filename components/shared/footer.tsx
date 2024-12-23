import TermsAndConditionsDialog from "./auth/terms_conditions";
import PrivacyPolicyDialog from "./auth/privacy_policy";
import RefundPolicyDialog from "./auth/refund_policy";
import AboutUsDialog from "./auth/about_us";
import ContactUsDialog from "./auth/contact_us";

const Footer = () => {
  return (
    <footer className="py-4 mt-auto w-full">
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center max-w-screen-xl mx-auto px-4 space-y-2 sm:space-y-0">
        <div className="flex space-x-4">
          <TermsAndConditionsDialog />
          <span className="text-sm text-muted-foreground">|</span>
          <PrivacyPolicyDialog />
          <span className="text-sm text-muted-foreground">|</span>
          <RefundPolicyDialog />
          <span className="text-sm text-muted-foreground">|</span>
          <AboutUsDialog />
          <span className="text-sm text-muted-foreground">|</span>
          <ContactUsDialog />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
