import log from 'loglevel';

export class Logger {
  private loggerInstance: any;

  constructor(customLogger?: any) {
    // Use the custom logger if provided, otherwise fall back to loglevel
    this.loggerInstance = customLogger || log;
  }

  setLogLevel(level: log.LogLevelDesc) {
    this.loggerInstance.setLevel(level);
  }

  debug(message: string, ...args: any[]) {
    this.loggerInstance.debug(message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.loggerInstance.info(message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.loggerInstance.warn(message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.loggerInstance.error(message, ...args);
  }
}

// Usage in your library code
const defaultLogger = new Logger();

export function someLibraryFunction() {
  defaultLogger.info("Running someLibraryFunction");
  // Your logic...
}
