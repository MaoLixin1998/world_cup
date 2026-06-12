package com.worldcup.api.fan.request;

/**
 * 创建匿名球迷身份的请求。
 *
 * <p>request 包只放“外部调用方传进来的参数对象”。它不连接数据库，也不写业务逻辑。
 */
public record CreateFanUserRequest(String uid, String nickname, String avatarPlayerId) {
}
