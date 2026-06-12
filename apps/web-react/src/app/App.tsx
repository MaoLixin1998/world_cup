import { useState } from "react";
import { FanIdentity } from "../fan/FanSetupForm";
import { FanSetupPage } from "../pages/fan-setup/FanSetupPage";
import { HomePage } from "../pages/home/HomePage";
import "../styles.css";

const fanIdentityStorageKey = "worldcup.fanIdentity";

function readStoredFanIdentity() {
  const storedValue = window.localStorage.getItem(fanIdentityStorageKey);
  if (!storedValue) {
    return null;
  }

  try {
    // localStorage 只能保存字符串，所以这里把 JSON 字符串还原成对象。
    return JSON.parse(storedValue) as FanIdentity;
  } catch {
    console.warn("读取本地球迷身份失败，将重新展示身份设置页");
    return null;
  }
}

export default function App() {
  const [fanIdentity, setFanIdentity] = useState<FanIdentity | null>(() => readStoredFanIdentity());

  function handleFanSetupSubmit(identity: FanIdentity) {
    console.info("首次进入身份设置完成", identity);
    window.localStorage.setItem(fanIdentityStorageKey, JSON.stringify(identity));
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
