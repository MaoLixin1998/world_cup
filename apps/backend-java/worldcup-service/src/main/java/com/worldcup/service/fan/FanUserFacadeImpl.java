package com.worldcup.service.fan;

import com.worldcup.api.fan.CreateFanUserRequest;
import com.worldcup.api.fan.FanUserFacade;
import com.worldcup.api.fan.FanUserResponse;
import com.worldcup.dal.fan.FanUserDO;
import com.worldcup.dal.fan.FanUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * 球迷身份业务服务。
 *
 * <p>service 层集中处理业务规则，Controller 和 DAL 都不要重复这部分判断。
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
