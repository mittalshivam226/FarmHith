export interface LogContext {
  [key: string]: unknown
}

export interface LogEntry {
  level: 'info' | 'warn' | 'error'
  message: string
  context?: LogContext
  timestamp: string
  service: string
}

/**
 * Logger utility for structured logging
 */
class Logger {
  private service: string

  constructor(service: string = 'farmhith') {
    this.service = service
  }

  private formatLog(level: LogEntry['level'], message: string, context?: LogContext): LogEntry {
    return {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      service: this.service,
    }
  }

  private log(entry: LogEntry): void {
    const logString = JSON.stringify(entry)

    switch (entry.level) {
      case 'info':
        console.info(logString)
        break
      case 'warn':
        console.warn(logString)
        break
      case 'error':
        console.error(logString)
        break
    }

    // TODO: In production, send logs to external service (e.g., LogRocket, Sentry)
    // this.sendToExternalService(entry)
  }

  /**
   * Logs an info message
   * @param message - Log message
   * @param context - Additional context data
   */
  info(message: string, context?: LogContext): void {
    const entry = this.formatLog('info', message, context)
    this.log(entry)
  }

  /**
   * Logs a warning message
   * @param message - Log message
   * @param context - Additional context data
   */
  warn(message: string, context?: LogContext): void {
    const entry = this.formatLog('warn', message, context)
    this.log(entry)
  }

  /**
   * Logs an error message
   * @param message - Log message
   * @param context - Additional context data
   */
  error(message: string, context?: LogContext): void {
    const entry = this.formatLog('error', message, context)
    this.log(entry)
  }

  /**
   * Logs an API request
   * @param method - HTTP method
   * @param path - Request path
   * @param userId - User ID if available
   * @param duration - Request duration in ms
   */
  apiRequest(method: string, path: string, userId?: string, duration?: number): void {
    this.info('API Request', {
      method,
      path,
      userId,
      duration,
    })
  }

  /**
   * Logs an API error
   * @param method - HTTP method
   * @param path - Request path
   * @param error - Error details
   * @param userId - User ID if available
   */
  apiError(method: string, path: string, error: Error | string, userId?: string): void {
    const errorMessage = error instanceof Error ? error.message : error
    this.error('API Error', {
      method,
      path,
      error: errorMessage,
      userId,
    })
  }

  /**
   * Logs database operation
   * @param operation - Database operation type
   * @param table - Table name
   * @param success - Whether operation was successful
   * @param duration - Operation duration in ms
   */
  databaseOperation(operation: string, table: string, success: boolean, duration?: number): void {
    this.info('Database Operation', {
      operation,
      table,
      success,
      duration,
    })
  }
}

// Export a default logger instance
export const logger = new Logger()

// Export the Logger class for creating service-specific loggers
export { Logger }
