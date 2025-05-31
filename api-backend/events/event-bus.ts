import { EventEmitter } from 'events';

type EventHandler<T = any> = (payload: T) => void;

class EventBus {
   private emitter = new EventEmitter();

   on<T = any>(event: string, handler: EventHandler<T>) {
      this.emitter.on(event, handler);
   }

   off<T = any>(event: string, handler: EventHandler<T>) {
      this.emitter.off(event, handler);
   }

   emit<T = any>(event: string, payload: T) {
      this.emitter.emit(event, payload);
   }
}

export const eventBus = new EventBus();