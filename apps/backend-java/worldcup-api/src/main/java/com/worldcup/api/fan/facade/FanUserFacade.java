package com.worldcup.api.fan.facade;

import com.worldcup.api.fan.request.CreateFanUserRequest;
import com.worldcup.api.fan.response.FanUserResponse;

/**
 * 球迷身份对外服务接口。
 *
 * <p>facade 包只描述“对外能提供什么能力”。未来如果需要通过 HSF/Dubbo 暴露服务，
 * 优先复用这个接口形态，而不是让调用方直接依赖 service 实现类。
 */
public interface FanUserFacade {
    FanUserResponse createFan(CreateFanUserRequest request);
}
