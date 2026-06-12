import { worldCupAssets } from "../../../shared/assets/worldCupAssets";

export type AvatarOption = {
  id: string;
  label: string;
  avatarSrc: string;
};

export const avatarOptions: AvatarOption[] = [
  { id: "messi", label: "梅西", avatarSrc: worldCupAssets.avatars.messi },
  { id: "ronaldo", label: "C 罗", avatarSrc: worldCupAssets.avatars.ronaldo },
  { id: "mbappe", label: "姆巴佩", avatarSrc: worldCupAssets.avatars.mbappe },
  { id: "neymar", label: "内马尔", avatarSrc: worldCupAssets.avatars.neymar },
  { id: "haaland", label: "哈兰德", avatarSrc: worldCupAssets.avatars.haaland },
  { id: "son", label: "孙兴慜", avatarSrc: worldCupAssets.avatars.son }
];
