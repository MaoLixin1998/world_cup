/**
 * 球迷身份的数据形状。
 *
 * <p>type 可以理解为“对象说明书”：告诉 TypeScript 这个对象必须有哪些字段。
 */
export type FanIdentity = {
  // 用户自己输入的唯一标识。MVP 没有登录系统，所以先靠 uid 识别用户。
  uid: string;
  // 页面上显示的昵称，可以为空；为空时页面会用 uid 兜底。
  nickname: string;
  // 用户选择的明星球员头像 id，例如 messi、haaland。
  avatarPlayerId: string;
};
