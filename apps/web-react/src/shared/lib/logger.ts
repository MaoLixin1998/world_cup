/* 前端日志出口：先保留 console，后续接埋点或可观测平台时只改这里。 */
export const logger = {
  info(message: string, data?: unknown) {
    if (data === undefined) {
      console.info(message);
      return;
    }
    console.info(message, data);
  },
  warn(message: string, data?: unknown) {
    if (data === undefined) {
      console.warn(message);
      return;
    }
    console.warn(message, data);
  }
};
