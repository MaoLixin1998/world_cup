/* 世界杯视觉资产路径集中放这里，后续切 OSS/CDN 时优先改这个文件。 */
export const worldCupAssets = {
  // 进入问答按钮左侧的小足球图标。
  footballIcon: "/assets/world-cup/football-icon.svg",
  // 进入问答按钮背景上的五边形足球纹理。
  buttonFootballPattern: "/assets/world-cup/button-football-pattern.svg",
  // 明星球员头像。key 要和 avatarOptions 里的 id 保持一致。
  avatars: {
    messi: "/assets/world-cup/avatars/messi.png",
    ronaldo: "/assets/world-cup/avatars/ronaldo.png",
    mbappe: "/assets/world-cup/avatars/mbappe.png",
    neymar: "/assets/world-cup/avatars/neymar.png",
    haaland: "/assets/world-cup/avatars/haaland.png",
    son: "/assets/world-cup/avatars/son.png"
  }
} as const;
