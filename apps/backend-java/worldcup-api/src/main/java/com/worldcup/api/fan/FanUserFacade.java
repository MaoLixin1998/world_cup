package com.worldcup.api.fan;

/**
 * 球迷身份对外服务接口。
 *
 * <p>未来如果需要通过 HSF/Dubbo 暴露服务，优先复用这个接口形态。
 */
public interface FanUserFacade {
    FanUserResponse createFan(CreateFanUserRequest request);
}
