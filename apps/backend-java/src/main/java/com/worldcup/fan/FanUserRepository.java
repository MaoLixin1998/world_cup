package com.worldcup.fan;

import java.util.Optional;

/**
 * 球迷身份仓库接口。
 *
 * <p>接口只描述“需要什么能力”，不规定数据放在哪里；MVP 可以用内存实现，
 * 以后接 PostgreSQL 时也不需要改 FanUserService 的业务规则。
 */
public interface FanUserRepository {
    Optional<FanUser> findByUid(String uid);

    FanUser save(FanUser fanUser);
}
