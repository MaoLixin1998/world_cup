package com.worldcup.fan;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 球迷身份业务服务。
 *
 * <p>它负责检查 UID 是否重复，并把合法的球迷身份交给仓库保存。
 * 先把规则集中在这里，后面无论从 Controller、定时任务还是测试调用，都复用同一套逻辑。
 */
public class FanUserService {
    private static final Logger log = LoggerFactory.getLogger(FanUserService.class);

    private final FanUserRepository repository;

    public FanUserService(FanUserRepository repository) {
        this.repository = repository;
    }

    public FanUser createFan(String uid, String nickname, String avatarPlayerId) {
        log.info("准备创建球迷身份，uid={}，nickname={}，avatarPlayerId={}", uid, nickname, avatarPlayerId);

        if (repository.findByUid(uid).isPresent()) {
            log.warn("创建球迷身份失败：UID 已存在，uid={}", uid);
            throw new IllegalArgumentException("UID 已存在");
        }

        FanUser fanUser = new FanUser(uid, nickname, avatarPlayerId);
        FanUser savedFan = repository.save(fanUser);
        log.info("球迷身份创建成功，uid={}", savedFan.uid());
        return savedFan;
    }
}
