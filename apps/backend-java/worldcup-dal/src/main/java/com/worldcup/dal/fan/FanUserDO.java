package com.worldcup.dal.fan;

/**
 * 球迷身份数据库对象。
 *
 * <p>DO 只描述持久化形态，不承担业务校验。
 */
public record FanUserDO(String uid, String nickname, String avatarPlayerId) {
}
