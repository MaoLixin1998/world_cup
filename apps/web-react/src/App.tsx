import { Search } from "lucide-react";
import "./styles.css";

export default function App() {
  return (
    <main className="app-shell">
      {/* 首页先保持为真实产品入口，而不是营销页；后续会逐步接入身份设置、问答和浏览入口。 */}
      <section className="home-panel" aria-labelledby="home-title">
        <div className="title-row">
          {/* 图标只做视觉辅助，aria-hidden 避免屏幕阅读器重复朗读。 */}
          <Search aria-hidden="true" size={28} />
          <h1 id="home-title">世界杯问答</h1>
        </div>
        <p>用中文提问，查看来源，轻松浏览世界杯资料。</p>
      </section>
    </main>
  );
}
