package com.worldcup.dal.fan.dataobject;

/**
 * 球迷身份数据库对象。
 *
 * <p>dataobject 包只描述数据库中的数据形态。DO 不承担业务校验，也不直接对外返回。
 */
public record FanUserDO(String uid, String nickname, String avatarPlayerId) {
}
