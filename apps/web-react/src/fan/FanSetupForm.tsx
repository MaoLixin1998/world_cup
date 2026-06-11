import { FormEvent, useState } from "react";

export type FanIdentity = {
  uid: string;
  nickname: string;
  avatarPlayerId: string;
};

const avatarOptions = [
  { id: "messi", label: "梅西", number: "10", avatarSrc: "/assets/world-cup/avatars/messi.svg" },
  { id: "ronaldo", label: "C 罗", number: "7", avatarSrc: "/assets/world-cup/avatars/ronaldo.svg" },
  { id: "mbappe", label: "姆巴佩", number: "10", avatarSrc: "/assets/world-cup/avatars/mbappe.svg" },
  { id: "neymar", label: "内马尔", number: "11", avatarSrc: "/assets/world-cup/avatars/neymar.svg" },
  { id: "haaland", label: "哈兰德", number: "9", avatarSrc: "/assets/world-cup/avatars/haaland.svg" },
  { id: "son", label: "孙兴慜", number: "7", avatarSrc: "/assets/world-cup/avatars/son.svg" }
];

type FanSetupFormProps = {
  onSubmit: (identity: FanIdentity) => void;
};

export function FanSetupForm({ onSubmit }: FanSetupFormProps) {
  const [uid, setUid] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatarPlayerId, setAvatarPlayerId] = useState("messi");
  const [uidError, setUidError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // MVP 先做最重要的必填校验，避免用户进入应用后没有可识别的身份。
    if (!uid.trim()) {
      setUidError("UID 不能为空");
      return;
    }

    setUidError("");
    console.info("保存球迷身份设置", { uid, nickname, avatarPlayerId });
    onSubmit({
      uid: uid.trim(),
      nickname: nickname.trim(),
      avatarPlayerId
    });
  }

  return (
    <section className="setup-panel" aria-labelledby="setup-title">
      <div className="setup-hero" aria-hidden="true" />

      {/* 金银铜领奖台既是视觉分界，也呼应世界杯排名语义。 */}
      <div className="podium-divider" aria-hidden="true">
        <img src="/assets/world-cup/podium.svg" alt="" />
      </div>

      <div className="setup-content">
        <p className="eyebrow">首次进入</p>
        <h1 id="setup-title">先设置你的球迷身份</h1>
        <p className="setup-intro">不用注册登录，填一个自己看得懂的 UID 和昵称就能开始使用。</p>

        <form className="fan-form" onSubmit={handleSubmit} aria-label="球迷身份设置">
          <label className="field">
            <span>UID</span>
            <input
              value={uid}
              onChange={(event) => {
                setUid(event.target.value);
                if (uidError) {
                  setUidError("");
                }
              }}
              placeholder="例如 fan-001"
              aria-describedby={uidError ? "uid-error" : undefined}
            />
            {uidError ? (
              <span className="field-error" id="uid-error">
                {uidError}
              </span>
            ) : null}
          </label>

          <label className="field">
            <span>昵称</span>
            <input value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="例如 小梅迷" />
          </label>

          <fieldset className="avatar-field">
            <legend>选择明星球员头像</legend>
            <div className="avatar-grid">
              {avatarOptions.map((avatar) => (
                <label className="avatar-option" key={avatar.id}>
                  <input
                    type="radio"
                    name="avatarPlayerId"
                    checked={avatarPlayerId === avatar.id}
                    onChange={() => setAvatarPlayerId(avatar.id)}
                  />
                  <img className="avatar-image" src={avatar.avatarSrc} alt="" aria-hidden="true" />
                  <span className="kit-badge" aria-hidden="true">
                    {avatar.number}
                  </span>
                  <span className="avatar-player-name">{avatar.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <p className="privacy-note">身份仅保存在本机，后续可以修改。</p>
          <button className="primary-action" type="submit">
            <img className="button-football-icon" src="/assets/world-cup/football-icon.svg" alt="" aria-hidden="true" />
            进入世界杯问答
          </button>
        </form>
      </div>
    </section>
  );
}
