import log from 'loglevel';

export interface EOILogger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

type LoggerInstance = EOILogger & {
  setLevel?: (level: log.LogLevelDesc) => void;
};

export class Logger implements EOILogger {
  private loggerInstance: LoggerInstance;

  constructor(customLogger?: EOILogger) {
    // Use the custom logger if provided, otherwise fall back to loglevel
    this.loggerInstance = (customLogger || log) as LoggerInstance;
  }

  setLogLevel(level: log.LogLevelDesc) {
    this.loggerInstance.setLevel?.(level);
  }

  debug(message: string, ...args: unknown[]) {
    this.loggerInstance.debug(message, ...args);
  }

  info(message: string, ...args: unknown[]) {
    this.loggerInstance.info(message, ...args);
  }

  warn(message: string, ...args: unknown[]) {
    this.loggerInstance.warn(message, ...args);
  }

  error(message: string, ...args: unknown[]) {
    this.loggerInstance.error(message, ...args);
  }
}

// Usage in your library code
const defaultLogger = new Logger();

export function someLibraryFunction() {
  defaultLogger.info("Running someLibraryFunction");
  // Your logic...
}
