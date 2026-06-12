/* 前端日志出口：先保留 console，后续接埋点或可观测平台时只改这里。 */
export const logger = {
  // 普通信息日志，比如“身份设置完成”。data 可选，有数据时一起打印。
  info(message: string, data?: unknown) {
    if (data === undefined) {
      console.info(message);
      return;
    }
    console.info(message, data);
  },
  // 警告日志，比如“本地缓存坏了”。不要在这里打印密钥、token 或大段用户输入。
  warn(message: string, data?: unknown) {
    if (data === undefined) {
      console.warn(message);
      return;
    }
    console.warn(message, data);
  }
};
