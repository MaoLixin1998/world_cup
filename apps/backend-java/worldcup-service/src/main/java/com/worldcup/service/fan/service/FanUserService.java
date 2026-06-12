package com.worldcup.service.fan.service;

import com.worldcup.api.fan.request.CreateFanUserRequest;
import com.worldcup.api.fan.response.FanUserResponse;

/**
 * 球迷身份内部业务服务接口。
 *
 * <p>service 包描述“系统内部业务能力”。Controller 可以调用它，未来 Facade 实现也可以调用它；
 * 但 api 模块里的对外契约不应该反过来承载内部 service 职责。
 */
public interface FanUserService {
    FanUserResponse createFan(CreateFanUserRequest request);
}
