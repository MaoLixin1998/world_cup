import { Search } from "lucide-react";
import { useState } from "react";
import { FanIdentity, FanSetupForm } from "./fan/FanSetupForm";
import "./styles.css";

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

  if (!fanIdentity) {
    return (
      <main className="app-shell">
        <FanSetupForm onSubmit={handleFanSetupSubmit} />
      </main>
    );
  }

  return (
    <main className="app-shell">
      {/* 首页先保持为真实产品入口，而不是营销页；后续会逐步接入身份设置、问答和浏览入口。 */}
      <section className="home-panel" aria-labelledby="home-title">
        <div className="title-row">
          {/* 图标只做视觉辅助，aria-hidden 避免屏幕阅读器重复朗读。 */}
          <Search aria-hidden="true" size={28} />
          <h1 id="home-title">世界杯问答</h1>
        </div>
        <p>{fanIdentity.nickname || fanIdentity.uid}，用中文提问，查看来源，轻松浏览世界杯资料。</p>
      </section>
    </main>
  );
}
