export function Signal<T>(initialValue: T) {
  let value = initialValue;
  const Emitter = {
    listeners: new Set<Function>(),
    subscribe(fn: (value: T) => void, sendInitialValue = true) {
      console.log('subscribe', fn);
      this.listeners.add(fn);
      if (sendInitialValue) {
        fn(value);
      }

      return () => this.listeners.delete(fn);
    },
    publish(nextValue: T | ((current: T) => T)) {
      if (typeof nextValue === 'function') {
        nextValue = nextValue(value);
      }
      value = nextValue;
      [...this.listeners].forEach((listener) => listener(value));
    },
  };
  return [
    Emitter.publish.bind(Emitter),
    Emitter.subscribe.bind(Emitter),
  ] as const;
}
