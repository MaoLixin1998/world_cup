package com.worldcup.dal.fan;

import java.util.Optional;

/**
 * 球迷身份仓库接口。
 *
 * <p>service 只依赖这个抽象；后续从内存切到 PostgreSQL 时，不需要改业务规则。
 */
public interface FanUserRepository {
    Optional<FanUserDO> findByUid(String uid);

    FanUserDO save(FanUserDO fanUser);
}
