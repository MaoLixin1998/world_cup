package com.worldcup.api.fan;

/**
 * 匿名球迷身份响应。
 *
 * <p>不要把数据库 DO 直接暴露给页面或远程服务消费者。
 */
public record FanUserResponse(String uid, String nickname, String avatarPlayerId) {
}
