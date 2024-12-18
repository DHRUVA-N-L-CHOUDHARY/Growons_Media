import TermsAndConditionsDialog from "./auth/terms_conditions";
import PrivacyPolicyDialog from "./auth/privacy_policy";

const Footer = () => {
  return (
    <footer className="py-4 mt-auto w-full">
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center max-w-screen-xl mx-auto px-4 space-y-2 sm:space-y-0">
        <div className="flex space-x-4 lg:px-40 px-10">
          <TermsAndConditionsDialog />
          <span className="text-sm text-muted-foreground">|</span>
          <PrivacyPolicyDialog />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
