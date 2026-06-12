export type AvatarOption = {
  id: string;
  label: string;
  avatarSrc: string;
};

export const avatarOptions: AvatarOption[] = [
  { id: "messi", label: "梅西", avatarSrc: "/assets/world-cup/avatars/messi.png" },
  { id: "ronaldo", label: "C 罗", avatarSrc: "/assets/world-cup/avatars/ronaldo.png" },
  { id: "mbappe", label: "姆巴佩", avatarSrc: "/assets/world-cup/avatars/mbappe.png" },
  { id: "neymar", label: "内马尔", avatarSrc: "/assets/world-cup/avatars/neymar.png" },
  { id: "haaland", label: "哈兰德", avatarSrc: "/assets/world-cup/avatars/haaland.png" },
  { id: "son", label: "孙兴慜", avatarSrc: "/assets/world-cup/avatars/son.png" }
];
