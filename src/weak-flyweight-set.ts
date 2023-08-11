export class WeakFlyweightSet<V extends object> {
  #size: number;
  #set: Set<WeakRef<V>>;
  #registry: FinalizationRegistry<WeakRef<V>>;

  constructor() {
    this.#size = 0;
    this.#set = new Set();
    this.#registry = new FinalizationRegistry((heldValue) => {
      this.#size--;
      this.#set.delete(heldValue);
    });
  }

  #isObject(value: any): value is Record<any, any> {
    return typeof value === 'object' && value !== null;
  }

  #compare(value1: any, value2: any): boolean {
    if (Array.isArray(value1) && Array.isArray(value2)) {
      if (value1.length !== value2.length) {
        return false;
      }

      const copy1 = value1.slice().sort();
      const copy2 = value1.slice().sort();

      for (let i = 0; i < copy1.length; i++) {
        if (!this.#compare(copy1[i], copy2[i])) {
          return false;
        }
      }
    } else if (this.#isObject(value1) && this.#isObject(value2)) {
      if (value1 === value2) {
        return true;
      } else if (Object.keys(value1).length !== Object.keys(value2).length) {
        return false;
      } else {
        for (const key in value1) {
          if (!this.#compare(value1[key], value2[key])) {
            return false;
          }
        }
      }
    } else if (!Object.is(value1, value2)) {
      return false;
    }

    return true;
  }

  #findRef(object: V): WeakRef<V> | undefined {
    for (const ref of this.#set.values()) {
      const value = ref.deref();

      if (this.#compare(object, value)) {
        return ref;
      }
    }
  }

  has(object: V): boolean {
    return !!this.get(object);
  }

  use(object: V): V {
    const value = this.get(object);

    if (typeof value === 'undefined') {
      this.add(object);

      return object;
    } else {
      return value;
    }
  }

  get(object: V): V | undefined {
    return this.#findRef(object)?.deref();
  }

  add(object: V): this {
    const oldRef = this.#findRef(object);

    if (typeof oldRef === 'undefined') {
      const ref = new WeakRef<V>(object);

      this.#size++;
      this.#set.add(ref);
      this.#registry.register(object, ref);
    }

    return this;
  }

  delete(object: V): boolean {
    const ref = this.#findRef(object);

    if (typeof ref === 'undefined') {
      return false;
    }

    const refObject = ref.deref();

    if (typeof refObject !== 'undefined') {
      this.#registry.unregister(refObject);
    }

    this.#size--;
    return this.#set.delete(ref);
  }

  clear() {
    for (const ref of this.#set.values()) {
      const value = ref.deref();

      if (typeof value !== 'undefined') {
        this.#registry.unregister(value);
      }
    }

    this.#size = 0;
    this.#set.clear();
  }

  forEach(cb: (value: V, set: WeakFlyweightSet<V>) => void, thisArg?: any) {
    this.#set.forEach((ref) => {
      const value = ref.deref();

      if (typeof value !== 'undefined') {
        cb.call(thisArg, value, this);
      }
    });
  }

  values(): IterableIterator<V> {
    const refs = this.#set.values();

    const next = (): IteratorResult<V> => {
      for (const ref of refs) {
        const value = ref.deref();

        if (typeof value !== 'undefined') {
          return {
            done: false,
            value: value,
          };
        }
      }

      return {
        done: true,
        value: undefined,
      };
    };

    return {
      [Symbol.iterator]() {
        return this;
      },
      next,
    };
  }

  get size() {
    return this.#size;
  }
}
