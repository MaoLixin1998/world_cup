import { FormEvent, useState } from "react";
import { Lock, ShieldCheck, UserRound } from "lucide-react";
import { worldCupAssets } from "../../../shared/assets/worldCupAssets";
import { logger } from "../../../shared/lib/logger";
import { Button } from "../../../shared/ui/Button";
import { Notice } from "../../../shared/ui/Notice";
import { TextField } from "../../../shared/ui/TextField";
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
    logger.info("保存球迷身份设置", { uid, nickname, avatarPlayerId });
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

            <TextField
              error={uidError}
              icon={<UserRound aria-hidden="true" size={22} />}
              label="UID"
              name="uid"
              onChange={(event) => {
                setUid(event.target.value);
                if (uidError) {
                  setUidError("");
                }
              }}
              placeholder="fan-001"
              value={uid}
            />

            <TextField
              icon={<UserRound aria-hidden="true" size={22} />}
              label="昵称"
              name="nickname"
              onChange={(event) => setNickname(event.target.value)}
              placeholder="小梅迷"
              value={nickname}
            />

            <Notice icon={<ShieldCheck aria-hidden="true" size={22} />}>
              你的身份仅保存在本地设备，用于个性化体验，隐私安全有保障。
            </Notice>
            <Button
              icon={<img className="button-football-icon" src={worldCupAssets.footballIcon} alt="" aria-hidden="true" />}
              type="submit"
            >
              进入世界杯问答
            </Button>
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
