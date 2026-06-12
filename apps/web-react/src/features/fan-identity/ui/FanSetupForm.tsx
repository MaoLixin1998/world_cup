import { FormEvent, useState } from "react";
import { Lock, ShieldCheck, UserRound } from "lucide-react";
import { avatarOptions } from "../data/avatarOptions";
import { FanIdentity } from "../model/fanIdentityTypes";
import { AvatarOptionCard } from "./AvatarOptionCard";

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
      <div className="setup-content">
        <form className="fan-form" onSubmit={handleSubmit} aria-label="球迷身份设置">
          <div className="setup-copy">
            <p className="eyebrow">首次进入</p>
            <h1 id="setup-title">先设置你的球迷身份</h1>
            <span className="title-divider" aria-hidden="true" />
            <p className="setup-intro">不用注册登录，填一个自己看得懂的 UID 和昵称就能开始使用。</p>

            <label className="field">
              <span>UID</span>
              <span className="input-shell">
                <UserRound aria-hidden="true" size={22} />
                <input
                  value={uid}
                  onChange={(event) => {
                    setUid(event.target.value);
                    if (uidError) {
                      setUidError("");
                    }
                  }}
                  placeholder="fan-001"
                  aria-describedby={uidError ? "uid-error" : undefined}
                />
              </span>
              {uidError ? (
                <span className="field-error" id="uid-error">
                  {uidError}
                </span>
              ) : null}
            </label>

            <label className="field">
              <span>昵称</span>
              <span className="input-shell">
                <UserRound aria-hidden="true" size={22} />
                <input value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="小梅迷" />
              </span>
            </label>

            <p className="privacy-note">
              <ShieldCheck aria-hidden="true" size={22} />
              <span>你的身份仅保存在本地设备，用于个性化体验，隐私安全有保障。</span>
            </p>
            <button className="primary-action" type="submit">
              <img className="button-football-icon" src="/assets/world-cup/football-icon.svg" alt="" aria-hidden="true" />
              进入世界杯问答
            </button>
            <p className="login-note">
              <Lock aria-hidden="true" size={16} />
              <span>无需注册登录 · 随时可更改身份设置</span>
            </p>
          </div>

          <fieldset className="avatar-field">
            <legend>选择你喜欢的明星球员头像</legend>
            <div className="avatar-grid">
              {avatarOptions.map((avatar) => (
                <AvatarOptionCard
                  avatar={avatar}
                  checked={avatarPlayerId === avatar.id}
                  key={avatar.id}
                  onChange={() => setAvatarPlayerId(avatar.id)}
                />
              ))}
            </div>
          </fieldset>
        </form>
      </div>
    </section>
  );
}
