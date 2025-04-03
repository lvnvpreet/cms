// client/src/components/editor/SyncEngine/EventBus.ts

type ListenerCallback<T = any> = (payload: T) => void;
type FilterFunction<T = any> = (payload: T) => boolean;

interface ListenerObject<T = any> {
  callback: ListenerCallback<T>;
  filter?: FilterFunction<T>;
  priority: number; // Higher numbers execute first
}

interface EventListeners {
  [eventName: string]: ListenerObject[];
}

class EventBus {
  private listeners: EventListeners = {};

  /**
   * Subscribes a listener function to a specific event, optionally with a filter.
   * @param eventName The name of the event to subscribe to.
   * @param callback The function to call when the event is published and the filter (if provided) passes.
   * @param options Optional settings for the subscription, including filter and priority.
   * @param options.filter An optional function that receives the payload and returns true if the listener should be called.
   * @param options.priority An optional number determining execution order (higher numbers execute first, default 0).
   * @returns A function to unsubscribe the listener.
   */
  subscribe<T>(
    eventName: string,
    callback: ListenerCallback<T>,
    options?: { filter?: FilterFunction<T>; priority?: number }
  ): () => void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    const listenerObject: ListenerObject<T> = {
      callback,
      filter: options?.filter,
      priority: options?.priority ?? 0, // Default priority to 0
    };
    this.listeners[eventName].push(listenerObject as ListenerObject);
    // Keep listeners sorted by priority after adding a new one
    this.listeners[eventName].sort((a, b) => b.priority - a.priority);

    // Return an unsubscribe function
    return () => {
      this.unsubscribe(eventName, callback); // Unsubscribe based on the original callback function
    };
  }

  /**
   * Unsubscribes a listener function from a specific event.
   * @param eventName The name of the event to unsubscribe from.
   * @param callback The original callback function used during subscription.
   */
  unsubscribe<T>(eventName: string, callback: ListenerCallback<T>): void {
    if (!this.listeners[eventName]) {
      return;
    }
    // Find the listener object by its callback function
    const index = this.listeners[eventName].findIndex(
      (listenerObj) => listenerObj.callback === (callback as ListenerCallback)
    );
    if (index > -1) {
      this.listeners[eventName].splice(index, 1);
    }
    // Clean up if no listeners remain for this event
    if (this.listeners[eventName].length === 0) {
      delete this.listeners[eventName];
    }
  }

  /**
   * Publishes an event asynchronously, calling all subscribed listeners after the current execution context.
   * Uses `setTimeout(..., 0)` for basic queueing/async behavior. This helps prevent blocking the main thread
   * but doesn't guarantee strict order between rapidly published events.
   * Consider using namespaced event names (e.g., 'ui:update', 'code:change', 'sync:status')
   * for better organization and potential filtering.
   * @param eventName The name of the event to publish (use namespaces like 'category:action').
   * @param payload The data to pass to the listeners.
   */
  publish<T>(eventName: string, payload: T): void {
    if (!this.listeners[eventName]) {
      return;
    }
    // Get listeners, already sorted by priority due to insertion sort
    const listenersToNotify = [...this.listeners[eventName]];

    // Execute listeners asynchronously
    setTimeout(() => {
      listenersToNotify.forEach((listenerObj) => {
        try {
          // Check filter before calling callback
          if (!listenerObj.filter || listenerObj.filter(payload)) {
            listenerObj.callback(payload);
          }
        } catch (error) {
          console.error(
            `Error in async listener for event "${eventName}":`,
            error
          );
        }
      });
    }, 0);
  }

  /**
   * Publishes an event synchronously, immediately calling all subscribed listeners.
   * Use this when immediate execution is required, but be mindful of potential performance implications
   * if listeners perform long-running tasks.
   * @param eventName The name of the event to publish (use namespaces like 'category:action').
   * @param payload The data to pass to the listeners.
   */
  publishSync<T>(eventName: string, payload: T): void {
    if (!this.listeners[eventName]) {
      return;
    }
    // Get listeners, already sorted by priority
    const listenersToNotify = [...this.listeners[eventName]];

    // Iterate over the sorted listeners
    listenersToNotify.forEach((listenerObj) => {
      try {
        // Check filter before calling callback
        if (!listenerObj.filter || listenerObj.filter(payload)) {
          listenerObj.callback(payload);
        }
      } catch (error) {
        console.error(`Error in sync listener for event "${eventName}":`, error);
      }
    });
  }
}

// Export a singleton instance
export const eventBus = new EventBus();
