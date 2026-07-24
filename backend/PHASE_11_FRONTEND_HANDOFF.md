# Phase 11 后端候选接口交接

更新日期：2026-07-24
后端状态：`IMPLEMENTED / TESTED / AWAITING_CONTRACT_FREEZE`
契约事实状态：contracts 1.8.0 中 dashboards、reminders 仍为
`DRAFT / NOT_STARTED`

## 先读结论

当前后端已经形成可评审、可测试的管理端候选实现，但**尚不能宣称严格按正式契约
交付**，原因是对应契约仍是草案，且草案元数据与实现存在明确差异。前端现在不要
直接修改正式类型、不要更新功能状态，也不要把真实 API 联调标记为通过。

| 项目 | contracts 1.8.0 草案 | 后端候选实现 | 前端当前状态 | 结论 |
| --- | --- | --- | --- | --- |
| 管理看板 | admin/trainer/student 三条路径 | 仅 admin | 当前只调用 admin | 需冻结路径范围 |
| 允许角色 | 含 trainer | 仅 super_admin/company_admin/store_manager | 管理页面使用管理角色 | 需冻结角色范围 |
| 管理看板响应 | 通用草案列表响应 | 具体对象响应 | 已能识别具体对象 | 字段契约待冻结 |
| 提醒列表响应 | 通用草案分页响应 | `{items,page,page_size,total}` | 仍期待扁平数组 | 当前无法直接联调 |
| read/dismiss | 通用草案写响应 | 幂等并返回更新后的提醒 | 不消费响应体 | 语义待冻结 |

## 权限边界

本文件只描述后端候选实现，不修改或替代 `contracts/**`，也不授权前端
将功能标记为 `CONTRACT_READY`、`INTEGRATED` 或 `VERIFIED`。

允许角色：

- `super_admin`：全局范围；
- `company_admin`：当前公司范围；
- `store_manager`：当前公司且仅所属门店；
- `trainer`、`student`：返回 403。

非超级管理员缺少公司、店长缺少门店时返回 403。提醒状态按当前用户隔离，
不能读取或修改其他用户的提醒状态。

## 候选接口

### 管理看板

`GET /api/dashboards/admin/`

```json
{
  "code": "OK",
  "message": "",
  "data": {
    "generated_at": "2026-07-24T10:00:00+08:00",
    "timezone": "Asia/Shanghai",
    "metrics": {
      "today_classes": 2,
      "today_bookings": 18,
      "active_students": 42,
      "pending_items": 3
    },
    "booking_trend": [
      {"label": "2026-07-18", "value": 9}
    ],
    "today_schedules": [
      {
        "id": 101,
        "time": "10:00",
        "course_name": "核心瑜伽",
        "trainer_name": "林教练",
        "room_name": "一号教室",
        "booked": 10,
        "capacity": 12
      }
    ]
  }
}
```

候选统计口径：

- 所有日历计算使用 `Asia/Shanghai`；
- 今日课程排除 `cancelled`；
- 今日预约只统计 `booked`；
- 活跃学员要求账号启用、会员启用且在有效期内，次卡/储值卡余额还必须大于 0；
- 趋势固定返回包含今天在内的最近 7 个本地日历日，空日期补 0；
- 空指标返回 0，空集合返回 `[]`。

### 提醒列表

`GET /api/reminders/?page=1&page_size=20&unread_only=false`

```json
{
  "code": "OK",
  "message": "",
  "data": {
    "items": [
      {
        "id": 1,
        "title": "课程已满员",
        "message": "10:00 的课程已达到 12 人容量。",
        "category": "booking",
        "priority": "high",
        "created_at": "2026-07-24T09:00:00+08:00",
        "is_read": false,
        "is_dismissed": false,
        "action_label": "查看排课",
        "action_to": "/admin/schedules/101"
      }
    ],
    "page": 1,
    "page_size": 20,
    "total": 1
  }
}
```

候选枚举：

- `category`: `booking | attendance | membership | training | system`
- `priority`: `high | normal | low`

候选规则：

- 排序为 `high`、`normal`、`low`，同优先级按创建时间倒序；
- 默认不返回已忽略提醒；
- `unread_only=true` 时只返回未读提醒，并在分页前完成筛选；
- `page_size` 最大 100；
- 站内动作只允许 `/admin/schedules`、`/admin/attendance`、
  `/admin/students`、`/admin/training-plans`、`/admin/class-records`
  及其数字详情路径，禁止外部 URL。
- 提醒来自当前业务数据，首次读取时为当前用户创建状态记录；因此提醒列表 GET
  以及管理看板 GET 的 `pending_items` 计算会产生提醒状态记录；
- 来源消失后不再返回该提醒，旧 ID 的 read/dismiss 返回 404，且不会修改旧状态；
- 同一来源以后重新出现时会复用原状态，因此已读/忽略状态会继续保留。保留期限
  尚未冻结。

### 状态动作

- `POST /api/reminders/{id}/read/`
- `POST /api/reminders/{id}/dismiss/`

请求体可以是空对象。两个动作均为幂等操作，成功返回更新后的单条提醒；
不存在或不属于当前用户的 ID 返回 404。

### 错误响应

沿用项目统一错误包裹，不会把错误放在成功响应的 `data` 中：

```json
{
  "code": "NOT_FOUND",
  "message": "资源不存在",
  "errors": {},
  "request_id": "req_example"
}
```

- 未登录或令牌无效：401 / `UNAUTHORIZED`
- 角色、公司或门店范围不允许：403 / `FORBIDDEN`
- 分页参数不是正整数或 `page_size > 100`：400 / `VALIDATION_ERROR`
- 提醒不存在、已失效或不属于当前用户：404 / `NOT_FOUND`

## 前端必须注意的差异

当前 `reminders.adapter.ts` 读取的是 `data: Reminder[]`。候选后端返回正式
分页包裹 `data: {items, page, page_size, total}`，因此在契约冻结后前端需要：

1. 运行正式契约生成命令；
2. 只在提醒 adapter 中读取 `response.data.data.items`；
3. 同步更新 MSW handler 与 adapter 测试；
4. 决定页面是一次请求 `page_size=100`，还是接入真正分页；
5. 看板 adapter 接受新增 `timezone`，页面 ViewModel 无需读取后端原始字段；
6. 仅在真实 API 联调通过后移除“草案/演示”状态。

当前无需前端处理的内容：

- 不要自行修改 `contracts/**` 或提前生成正式类型；
- 不要为了迁就当前 adapter 要求后端临时返回扁平数组；
- 不要实现 `/dashboards/trainer/` 或 `/dashboards/student/` 的前端接入；
- 不要把浏览器单 worker 的 Mock 用例通过等同于真实 API 联调通过。

## 需要契约负责人冻结的决策

1. 是否接受管理端仅三个角色，明确排除 trainer/student；
2. 是否接受上述时区、活跃会员和七日趋势口径；
3. 提醒列表是否必须分页、默认/最大页大小以及 `unread_only`；
4. 分类、优先级枚举和排序规则；
5. 提醒来源消失后，历史状态的保留期限；
6. 已读/忽略是否允许恢复；
7. 站内动作链接白名单；
8. read/dismiss 的 404、403 与幂等响应语义。
9. GET 读取时创建每用户状态记录是否可接受；
10. 是否需要 trainer/student 看板，以及它们是否属于本阶段。

## 后端验证证据

- 迁移漂移检查通过；
- Django 系统检查通过；
- 后端完整回归：59 项通过；
- Phase 11 专项：8 项通过；
- 覆盖管理角色权限、跨公司/跨门店范围、跨用户状态隔离、分页结构、动作白名单、
  read/dismiss 幂等，以及失效提醒不可修改。

## 建议协作顺序

1. 后端负责人提交本候选实现和本交接文件；
2. 契约负责人审阅上述 10 项决策，冻结新版本并更新状态；
3. 前端负责人基于已冻结契约生成类型，只修改 adapter、Mock、测试和必要分页 UI；
4. 使用超级管理员、公司管理员、店长和两个租户执行真实联调；
5. 覆盖空数据、400、401、403、404、分页边界和跨租户访问；
6. 浏览器 E2E 与真实 API 联调均通过后，再标记 `INTEGRATED / VERIFIED`。

## 可直接转发给前端的协作内容

> Phase 11 后端管理看板与提醒已经完成候选实现和后端专项验证，但 contracts
> 1.8.0 仍把两项标记为 DRAFT / NOT_STARTED，因此目前不是正式联调通知。
> 请先参与确认角色范围、响应字段、提醒分页和状态语义。当前 reminder adapter
> 期待扁平数组，而候选 API 返回分页对象，这一处会直接触发
> `REMINDER_CONTRACT_MISMATCH`。契约冻结后，请基于新契约更新生成类型、
> adapter、MSW 与测试，再安排真实 API 联调；在此之前不要标记
> CONTRACT_READY、INTEGRATED 或 VERIFIED。后端接口、示例和待决策项见本文。
