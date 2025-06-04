import { EventEmitter } from 'events';
import { logger } from '../config/logger';

type EventHandler<T = any> = (payload: T) => void;

class EventBus {
   private emitter = new EventEmitter();

   on<T = any>(event: string, handler: EventHandler<T>) {
      this.emitter.on(event, handler);
      logger.info(`Event listener registered for: ${event}`);
   }

   off<T = any>(event: string, handler: EventHandler<T>) {
      this.emitter.off(event, handler);
      logger.info(`Event listener removed for: ${event}`);
   }

   emit<T = any>(event: string, payload: T) {
      this.emitter.emit(event, payload);
      logger.info(`Event emitted: ${event}`, payload);
   }
}

export const eventBus = new EventBus();