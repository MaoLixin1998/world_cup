package com.worldcup.api.fan;

/**
 * 创建匿名球迷身份的请求。
 *
 * <p>api 模块只定义对外契约，不关心请求来自 REST、HSF 还是 Dubbo。
 */
public record CreateFanUserRequest(String uid, String nickname, String avatarPlayerId) {
}
