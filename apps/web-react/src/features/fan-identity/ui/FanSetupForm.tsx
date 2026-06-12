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

// 这个表单组件只需要父组件传一个 onSubmit 函数。
// 表单内部负责收集 uid、昵称、头像；真正保存数据由父组件决定。
type FanSetupFormProps = {
  onSubmit: (identity: FanIdentity) => void;
};

/**
 * 首次进入时的球迷身份设置表单。
 *
 * <p>它包含三块：
 * 1. 左侧说明文案和两个输入框；
 * 2. 右侧明星球员头像选择；
 * 3. 底部“进入世界杯问答”提交按钮。
 */
export function FanSetupForm({ onSubmit }: FanSetupFormProps) {
  // uid 是用户输入的身份标识，对 MVP 来说它是必填项。
  const [uid, setUid] = useState("");
  // nickname 是用户昵称，可以为空；为空时首页会用 uid 兜底。
  const [nickname, setNickname] = useState("");
  // avatarPlayerId 保存当前选中的球员头像 id。默认选梅西。
  const [avatarPlayerId, setAvatarPlayerId] = useState("messi");
  // uidError 只保存 UID 输入框的错误提示；没有错误时是空字符串。
  const [uidError, setUidError] = useState("");

  /**
   * 表单提交函数。
   *
   * <p>浏览器表单默认会刷新页面，所以第一行 event.preventDefault()
   * 是为了阻止刷新，让 React 在当前页面里处理提交。
   */
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
    // section 是一个页面区域；aria-labelledby 指向 h1，让辅助技术知道这个区域标题。
    <section className="setup-panel" aria-labelledby="setup-title">
      <div className="setup-content">
        {/* form 是真正的表单容器，点击 submit 按钮时会触发 handleSubmit。 */}
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
                // 用户输入时更新 uid 状态；React 会自动重新渲染页面。
                setUid(event.target.value);
                // 如果之前显示过错误，用户重新输入后先清掉错误，体验更自然。
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
              // 昵称不是必填，所以只需要把输入内容记到状态里。
              onChange={(event) => setNickname(event.target.value)}
              placeholder="小梅迷"
              value={nickname}
            />

            {/* Notice 是通用提示条组件，这里用于解释身份只保存在本机。 */}
            <Notice icon={<ShieldCheck aria-hidden="true" size={22} />}>
              你的身份仅保存在本地设备，用于个性化体验，隐私安全有保障。
            </Notice>
            {/* Button 是通用按钮组件；type="submit" 表示点击它会提交上面的 form。 */}
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

          {/* fieldset 用来包住一组相关表单控件；这里是一组头像单选项。 */}
          <fieldset className="avatar-field">
            <legend>选择你喜欢的明星球员头像</legend>
            <div className="avatar-grid">
              {/* map 会把头像数组里的每一项，转换成一张 AvatarOptionCard。 */}
              {avatarOptions.map((avatar) => (
                <AvatarOptionCard
                  avatar={avatar}
                  checked={avatarPlayerId === avatar.id}
                  // key 帮 React 识别列表中的每一张卡，避免更新时混乱。
                  key={avatar.id}
                  // 点击卡片时，把当前选中的头像 id 更新到状态里。
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
