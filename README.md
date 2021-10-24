# WeakFlyweightSet

The `WeakFlyweightSet` object holds weak references to similar objects. 

A weak reference to an object is a reference that does not prevent the object from being reclaimed by the garbage collector. In contrast, a normal (or strong) reference keeps an object in memory.

> Flyweight is a structural design pattern that lets you fit more objects into the available amount of RAM by sharing common parts of state between multiple objects instead of keeping all of the data in each object.
>
> – [Refacrtoring Guru](https://refactoring.guru/design-patterns/flyweight)

The `WeakFlyweightSet` is based on [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set), [WeakRef](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef) and [FinalizationRegistry](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry) objects.

* No dependencies
* TypeScript
* ES2021
* Node.js >=14.6.0

## Installation

```
npm i weak-flyweight-set
```

## Example

```javascript
const set = new WeakFlyweightSet();

let valueObject = {key1: 'value: 1', key2: 'value: 2'};

set.add(valueObject);

// all of the following calls return a reference to the same object
set.get({key1: 'value: 1', key2: 'value: 2'});
set.use({key1: 'value: 1', key2: 'value: 2'});

valueObject = null;

// ...
// GC reclaims space
// ...

// returns undefined
set.get({key1: 'value: 1', key2: 'value: 2'});

// return a reference to a new object
set.use({key1: 'value: 1', key2: 'value: 2'});
```

## API

#### add(object): this

The `add()` method adds an object to a `WeakFlyweightSet` object.

#### get(object): object | undefined

The `get()` method returns a reference to a similar object from a `WeakFlyweightSet` object or undefined.

#### use(object): object

The `use()` method returns a reference to a similar object from a `WeakFlyweightSet` object or adds the specified object to the set and returns a reference to it.

#### has(object): boolean

The `has()` method returns a boolean indicating whether a similar object exists or not.

#### delete(object): boolean

The `delete()` method removes a similar object from a `WeakFlyweightSet`.

#### values(): IterableIterator\<object\>

The `values()` method returns a new `Iterator` object that contains the values for each element in the `WeakFlyweightSet` object in insertion order.

#### forEach(cb): void

The `forEach()` method executes a provided function once per each value in the `WeakFlyweightSet` object, in insertion order.

#### clear(): void

The `clear()` method removes all elements from a `WeakFlyweightSet` object.

## License

WeakFlyweightSet is [MIT licensed](LICENSE.md).
