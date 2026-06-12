import { AvatarOption } from "../data/avatarOptions";

type AvatarOptionCardProps = {
  avatar: AvatarOption;
  checked: boolean;
  onChange: () => void;
};

export function AvatarOptionCard({ avatar, checked, onChange }: AvatarOptionCardProps) {
  return (
    <label className="avatar-option">
      <input type="radio" name="avatarPlayerId" checked={checked} onChange={onChange} />
      <span className="avatar-check" aria-hidden="true">✓</span>
      <img className="avatar-image" src={avatar.avatarSrc} alt="" aria-hidden="true" />
      <span className="avatar-player-name">{avatar.label}</span>
    </label>
  );
}
