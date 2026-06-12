import { Search } from "lucide-react";

type HomePageProps = {
  fanName: string;
};

export function HomePage({ fanName }: HomePageProps) {
  return (
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
