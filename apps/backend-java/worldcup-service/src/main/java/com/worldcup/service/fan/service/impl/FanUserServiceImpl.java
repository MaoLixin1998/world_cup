package com.worldcup.service.fan.service.impl;

import com.worldcup.api.fan.request.CreateFanUserRequest;
import com.worldcup.api.fan.response.FanUserResponse;
import com.worldcup.dal.fan.dataobject.FanUserDO;
import com.worldcup.dal.fan.repository.FanUserRepository;
import com.worldcup.service.fan.service.FanUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * 球迷身份内部业务服务实现。
 *
 * <p>service.impl 包放内部业务实现。它负责业务规则、日志和调用 DAL；
 * Controller 或未来的 FacadeImpl 都应该通过 {@link FanUserService} 接口使用它。
 */
@Service
public class FanUserServiceImpl implements FanUserService {
    private static final Logger log = LoggerFactory.getLogger(FanUserServiceImpl.class);

    private final FanUserRepository repository;

    public FanUserServiceImpl(FanUserRepository repository) {
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
