package com.worldcup.dal.fan.repository;

import com.worldcup.dal.fan.dataobject.FanUserDO;
import java.util.Optional;

/**
 * 球迷身份仓库接口。
 *
 * <p>repository 包放“数据访问抽象”。service 只依赖这个接口，不关心数据最终来自内存还是 PostgreSQL。
 */
public interface FanUserRepository {
    Optional<FanUserDO> findByUid(String uid);

    FanUserDO save(FanUserDO fanUser);
}
