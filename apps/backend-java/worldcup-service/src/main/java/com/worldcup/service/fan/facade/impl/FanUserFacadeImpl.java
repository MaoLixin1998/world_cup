package com.worldcup.service.fan.facade.impl;

import com.worldcup.api.fan.facade.FanUserFacade;
import com.worldcup.api.fan.request.CreateFanUserRequest;
import com.worldcup.api.fan.response.FanUserResponse;
import com.worldcup.dal.fan.dataobject.FanUserDO;
import com.worldcup.dal.fan.repository.FanUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * 球迷身份对外服务实现。
 *
 * <p>facade.impl 包放 api facade 的具体实现。Controller 或远程调用入口只应该依赖
 * {@link FanUserFacade} 接口，不应该依赖这个实现类。
 */
@Service
public class FanUserFacadeImpl implements FanUserFacade {
    private static final Logger log = LoggerFactory.getLogger(FanUserFacadeImpl.class);

    private final FanUserRepository repository;

    public FanUserFacadeImpl(FanUserRepository repository) {
        this.repository = repository;
    }

    @Override
    public FanUserResponse createFan(CreateFanUserRequest request) {
        log.info("准备创建球迷身份，uid={}，nickname={}，avatarPlayerId={}",
            request.uid(), request.nickname(), request.avatarPlayerId());

        if (repository.findByUid(request.uid()).isPresent()) {
            log.warn("创建球迷身份失败：UID 已存在，uid={}", request.uid());
            throw new IllegalArgumentException("UID 已存在");
        }

        FanUserDO savedFan = repository.save(new FanUserDO(
            request.uid(),
            request.nickname(),
            request.avatarPlayerId()
        ));
        log.info("球迷身份创建成功，uid={}", savedFan.uid());
        return new FanUserResponse(savedFan.uid(), savedFan.nickname(), savedFan.avatarPlayerId());
    }
}
