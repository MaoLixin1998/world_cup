import { Search } from "lucide-react";

// HomePageProps 描述 HomePage 这个组件需要哪些外部数据。
type HomePageProps = {
  // fanName 是首页欢迎文案里展示的球迷名称，可能来自昵称，也可能来自 uid。
  fanName: string;
};

/**
 * 已完成身份设置后的首页壳。
 *
 * <p>现在只展示“世界杯问答”的入口文案；后续真正的聊天输入框、资料浏览入口会继续放到这里。
 */
export function HomePage({ fanName }: HomePageProps) {
  return (
    // aria-labelledby 把这个区域和 h1 绑定，屏幕阅读器能知道这个 section 的标题是什么。
    <section className="home-panel" aria-labelledby="home-title">
      <div className="title-row">
        {/* 图标只做视觉辅助，aria-hidden 避免屏幕阅读器重复朗读。 */}
        <Search aria-hidden="true" size={28} />
        <h1 id="home-title">世界杯问答</h1>
      </div>
      <p>{fanName}，用中文提问，查看来源，轻松浏览世界杯资料。</p>
    </section>
  );
}
