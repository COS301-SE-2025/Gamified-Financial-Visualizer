import { createLogger, format, transports } from 'winston';
var combine = format.combine, timestamp = format.timestamp, printf = format.printf, colorize = format.colorize, errors = format.errors;
var logFormat = printf(function (_a) {
    var level = _a.level, message = _a.message, timestamp = _a.timestamp, stack = _a.stack;
    return "[".concat(timestamp, "] ").concat(level, ": ").concat(stack || message);
});
export var logger = createLogger({
    level: 'info',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), logFormat),
    transports: [
        new transports.Console({
            format: combine(colorize(), logFormat)
        }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
    ],
    exitOnError: false
});
