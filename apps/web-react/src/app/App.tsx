import { useState } from "react";
import { FanIdentity, readFanIdentity, saveFanIdentity } from "../features/fan-identity";
import { FanSetupPage } from "../pages/fan-setup/FanSetupPage";
import { HomePage } from "../pages/home/HomePage";
import { logger } from "../shared/lib/logger";
import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/layout.css";
import "../styles.css";

/**
 * App 是 React 前端的“总入口组件”。
 *
 * <p>你可以把它理解成页面总开关：
 * 如果本机还没有保存球迷身份，就显示身份设置页；
 * 如果已经有身份，就显示世界杯问答首页。
 */
export default function App() {
  // useState 是 React 的“状态记忆”工具。
  // 这里的 fanIdentity 表示当前用户身份；setFanIdentity 用来更新这个身份。
  // 括号里的 readFanIdentity 只会在首次打开页面时执行一次，用来读取 localStorage。
  const [fanIdentity, setFanIdentity] = useState<FanIdentity | null>(() => readFanIdentity());

  /**
   * 身份设置表单提交后会调用这个函数。
   *
   * <p>这个函数做两件事：
   * 1. 把身份保存到浏览器本地 localStorage，下次刷新还能记住；
   * 2. 更新 React 状态，让页面立刻从“设置页”切到“首页”。
   */
  function handleFanSetupSubmit(identity: FanIdentity) {
    logger.info("首次进入身份设置完成", identity);
    saveFanIdentity(identity);
    setFanIdentity(identity);
  }

  return (
    <main className="app-shell">
      {/* 三元表达式：条件 ? 条件成立显示这个 : 条件不成立显示那个。 */}
      {!fanIdentity ? (
        // 没有身份：显示首次进入的球迷身份设置页。
        <FanSetupPage onSubmit={handleFanSetupSubmit} />
      ) : (
        // 有身份：显示真正的产品首页。昵称为空时，用 uid 兜底展示。
        <HomePage fanName={fanIdentity.nickname || fanIdentity.uid} />
      )}
    </main>
  );
}
