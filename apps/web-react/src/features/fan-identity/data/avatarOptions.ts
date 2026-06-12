import { worldCupAssets } from "../../../shared/assets/worldCupAssets";

// 单个头像选项的数据结构。UI 卡片会根据这些字段展示图片和姓名。
export type AvatarOption = {
  // 程序内部使用的稳定 id，提交表单时保存这个值。
  id: string;
  // 页面上给用户看的中文名字。
  label: string;
  // 头像图片路径。路径统一来自 worldCupAssets，后续切 CDN 时不用到处找。
  avatarSrc: string;
};

// 明星球员头像候选列表。表单会 map 这个数组，生成 6 张头像卡片。
export const avatarOptions: AvatarOption[] = [
  { id: "messi", label: "梅西", avatarSrc: worldCupAssets.avatars.messi },
  { id: "ronaldo", label: "C 罗", avatarSrc: worldCupAssets.avatars.ronaldo },
  { id: "mbappe", label: "姆巴佩", avatarSrc: worldCupAssets.avatars.mbappe },
  { id: "neymar", label: "内马尔", avatarSrc: worldCupAssets.avatars.neymar },
  { id: "haaland", label: "哈兰德", avatarSrc: worldCupAssets.avatars.haaland },
  { id: "son", label: "孙兴慜", avatarSrc: worldCupAssets.avatars.son }
];
