import { FanIdentity, FanSetupForm } from "../../fan/FanSetupForm";

type FanSetupPageProps = {
  onSubmit: (identity: FanIdentity) => void;
};

export function FanSetupPage({ onSubmit }: FanSetupPageProps) {
  return <FanSetupForm onSubmit={onSubmit} />;
}
