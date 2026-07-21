/**
 * 统一 API 错误类型。
 *
 * 与后端约定的错误响应结构对齐（双人开发交接与对齐规范  § 2.2）：
 *   { code, message, errors?, request_id? }
 */
export class ApiError extends Error {
  /** 业务错误码（如 "BOOKING_CAPACITY_FULL"） */
  readonly code: string;
  /** HTTP 状态码 */
  readonly httpStatus: number;
  /** 字段级校验错误 */
  readonly fieldErrors: Record<string, string[]>;
  /** 请求追踪 ID */
  readonly requestId?: string;

  constructor(
    httpStatus: number,
    code: string,
    message: string,
    fieldErrors: Record<string, string[]> = {},
    requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
    this.httpStatus = httpStatus;
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.requestId = requestId;
  }

  /** 是否为认证失败（401） */
  get isUnauthorized(): boolean {
    return this.httpStatus === 401;
  }

  /** 是否为权限不足（403） */
  get isForbidden(): boolean {
    return this.httpStatus === 403;
  }

  /** 是否为资源不存在（404） */
  get isNotFound(): boolean {
    return this.httpStatus === 404;
  }

  /** 是否为业务冲突（409） */
  get isConflict(): boolean {
    return this.httpStatus === 409;
  }

  /** 是否为请求校验失败（400） */
  get isValidationError(): boolean {
    return this.httpStatus === 400;
  }

  /** 是否为服务端错误（5xx） */
  get isServerError(): boolean {
    return this.httpStatus >= 500;
  }

  /** 获取指定字段的第一条错误消息 */
  fieldMessage(field: string): string | undefined {
    return this.fieldErrors[field]?.[0];
  }
}

/** 网络错误或请求超时 */
export class NetworkError extends Error {
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'NetworkError';
    this.cause = cause;
  }
}
