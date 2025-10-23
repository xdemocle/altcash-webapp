type Level = 'debug' | 'info' | 'warn' | 'error';

type LogInput = unknown;

const normalize = (level: Level, args: LogInput[]) => {
  const now = new Date().toISOString();
  let payload: Record<string, unknown> = {};

  // If first arg is a plain object, treat it as the base payload
  const first = args[0];
  const isPlainObject = typeof first === 'object' && first !== null && !Array.isArray(first);

  if (isPlainObject && !(first instanceof Error)) {
    payload = { ...(first as Record<string, unknown>) };
  } else {
    // Concatenate args into a message string
    const message = args
      .map(a =>
        typeof a === 'string' ? a
        : a instanceof Error ? a.message
        : JSON.stringify(a)
      )
      .join(' ');
    payload = { message };
  }

  // Attach error stack if present in args
  const errorArg = args.find(a => a instanceof Error) as Error | undefined;
  if (errorArg && !('stack' in payload)) {
    payload.stack = errorArg.stack;
  }

  // Ensure level and timestamp
  if (!('level' in payload)) payload.level = level;
  if (!('timestamp' in payload)) payload.timestamp = now;

  return payload;
};

const log = (level: Level, ...args: LogInput[]) => {
  const entry = normalize(level, args);
  // Print as JSON for consistency with previous logs
  const line = JSON.stringify(entry);
  switch (level) {
    case 'debug':
      console.debug(line);
      break;
    case 'info':
      console.info(line);
      break;
    case 'warn':
      console.warn(line);
      break;
    case 'error':
      console.error(line);
      break;
  }
};

const logger = {
  debug: (...args: LogInput[]) => log('debug', ...args),
  info: (...args: LogInput[]) => log('info', ...args),
  warn: (...args: LogInput[]) => log('warn', ...args),
  error: (...args: LogInput[]) => log('error', ...args),
};

export default logger;
