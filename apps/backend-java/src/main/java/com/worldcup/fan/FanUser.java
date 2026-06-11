package com.worldcup.fan;

/**
 * 球迷身份信息。
 *
 * <p>这里先用 Java record 表达一个“只保存数据”的小模型：
 * uid 是用户自己输入的唯一标识，nickname 是页面展示名，avatarPlayerId 是选择的明星球员头像。
 */
public record FanUser(String uid, String nickname, String avatarPlayerId) {
}
