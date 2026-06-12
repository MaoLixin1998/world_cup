import { AvatarOption } from "../data/avatarOptions";

// 头像卡片需要父组件传入三样东西：头像数据、是否选中、点击后的处理函数。
type AvatarOptionCardProps = {
  // 当前卡片展示哪个球员。
  avatar: AvatarOption;
  // checked 为 true 时，radio 会被选中，卡片右上角也会出现绿色勾。
  checked: boolean;
  // 用户点击这张卡片时，通知父组件更新当前选择。
  onChange: () => void;
};

/**
 * 单张明星球员头像卡片。
 *
 * <p>这里用 label 包住 radio、图片和名字，所以用户点卡片任意位置都能选中。
 */
export function AvatarOptionCard({ avatar, checked, onChange }: AvatarOptionCardProps) {
  return (
    <label className="avatar-option">
      {/* radio 是真正的表单控件；视觉上会隐藏，但保留键盘和无障碍能力。 */}
      <input type="radio" name="avatarPlayerId" checked={checked} onChange={onChange} />
      {/* 这个绿色勾只做视觉提示，选中状态仍然由上面的 radio 负责。 */}
      <span className="avatar-check" aria-hidden="true">✓</span>
      {/* 图片是装饰性头像，姓名已经在下方文本里，所以 alt 留空并标记 aria-hidden。 */}
      <img className="avatar-image" src={avatar.avatarSrc} alt="" aria-hidden="true" />
      <span className="avatar-player-name">{avatar.label}</span>
    </label>
  );
}
