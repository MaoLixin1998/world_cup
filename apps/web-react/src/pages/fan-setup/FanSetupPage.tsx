import { FanIdentity, FanSetupForm } from "../../features/fan-identity";

// Page 层只做“页面编排”：决定这一页放哪个业务组件，不在这里写复杂表单逻辑。
type FanSetupPageProps = {
  // onSubmit 是父组件 App 传进来的回调；表单提交成功后，把身份交回 App 保存。
  onSubmit: (identity: FanIdentity) => void;
};

export function FanSetupPage({ onSubmit }: FanSetupPageProps) {
  // 真正的表单输入、校验、头像选择都在 FanSetupForm 里。
  return <FanSetupForm onSubmit={onSubmit} />;
}
