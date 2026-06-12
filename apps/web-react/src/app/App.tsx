import { useState } from "react";
import { FanIdentity, readFanIdentity, saveFanIdentity } from "../features/fan-identity";
import { FanSetupPage } from "../pages/fan-setup/FanSetupPage";
import { HomePage } from "../pages/home/HomePage";
import "../styles.css";

export default function App() {
  const [fanIdentity, setFanIdentity] = useState<FanIdentity | null>(() => readFanIdentity());

  function handleFanSetupSubmit(identity: FanIdentity) {
    console.info("首次进入身份设置完成", identity);
    saveFanIdentity(identity);
    setFanIdentity(identity);
  }

  return (
    <main className="app-shell">
      {!fanIdentity ? (
        <FanSetupPage onSubmit={handleFanSetupSubmit} />
      ) : (
        <HomePage fanName={fanIdentity.nickname || fanIdentity.uid} />
      )}
    </main>
  );
}
