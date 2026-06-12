// feature 的统一出口。
// 外部页面只从这里 import，不需要知道内部 model/ui/data 文件怎么组织。
export type { FanIdentity } from "./model/fanIdentityTypes";
export { readFanIdentity, saveFanIdentity } from "./model/fanIdentityStorage";
export { FanSetupForm } from "./ui/FanSetupForm";
