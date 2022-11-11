export function Signal(initialValue) {
  let value = initialValue;
  const Emitter = {
    listeners: new Set<Function>(),
    subscribe(fn) {
      console.log("subscribe", fn);
      this.listeners.add(fn);
      fn(value);
      return () => this.listeners.delete(fn);
    },
    publish(nextValue) {
      if (typeof nextValue === "function") {
        nextValue = nextValue(value);
      }
      value = nextValue;
      [...this.listeners].forEach((listener) => listener(value));
    },
  };
  return [Emitter.publish.bind(Emitter), Emitter.subscribe.bind(Emitter)];
}
