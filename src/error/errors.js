export class AppError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AppError'
  }
}

export class FieldValidationError extends AppError {
  constructor(message, field, rule) {
    super(message)
    this.name = 'FieldValidationError'
    this.field = field
    this.rule = rule
  }
}

export class NetworkError extends AppError {
  constructor(message) {
    super(message)
    this.name = 'NetworkError'
  }
}

export class RequestTimeoutError extends AppError {
  constructor(message) {
    super(message)
    this.name = 'RequestTimeoutError'
  }
}

export class ApiError extends AppError {
  constructor(message, statusCode, code, issues = null) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code
    this.issues = issues
  }
}
