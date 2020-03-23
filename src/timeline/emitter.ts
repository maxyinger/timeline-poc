export type Subscriber<T> = (v: T) => void;
export type Unsubscribe = () => void;
export type Subscribe<T> = (fn: Subscriber<T>) => Unsubscribe;

const emitter = <T>() => {
  const subscribers = new Set<Subscriber<T>>();

  const emit = (v: T) => {
    subscribers.forEach(subscriber => {
      subscriber(v);
    });
  };

  const subscribe = (subscriber: Subscriber<T>): Unsubscribe => {
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
    };
  };

  return {
    emit,
    subscribe
  };
};

export default emitter;
