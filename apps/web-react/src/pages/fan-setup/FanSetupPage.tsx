import { FanIdentity, FanSetupForm } from "../../features/fan-identity";

type FanSetupPageProps = {
  onSubmit: (identity: FanIdentity) => void;
};

export function FanSetupPage({ onSubmit }: FanSetupPageProps) {
  return <FanSetupForm onSubmit={onSubmit} />;
}
