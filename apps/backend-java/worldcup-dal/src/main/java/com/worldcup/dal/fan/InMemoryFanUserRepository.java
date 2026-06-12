package com.worldcup.dal.fan;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

/**
 * MVP 阶段的内存仓库。
 *
 * <p>它让 service/start 分层先稳定下来；接 PostgreSQL 时只替换 DAL 实现，不改业务规则。
 */
@Repository
public class InMemoryFanUserRepository implements FanUserRepository {
    private final Map<String, FanUserDO> fanUsers = new ConcurrentHashMap<>();

    @Override
    public Optional<FanUserDO> findByUid(String uid) {
        return Optional.ofNullable(fanUsers.get(uid));
    }

    @Override
    public FanUserDO save(FanUserDO fanUser) {
        fanUsers.put(fanUser.uid(), fanUser);
        return fanUser;
    }
}
