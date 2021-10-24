import { WeakFlyweightSet } from '../src';

declare function gc(): void;

describe('WeakFlyweightSet', () => {
  let set: WeakFlyweightSet<object>;

  beforeEach(() => {
    set = new WeakFlyweightSet();
  });

  it('should add an object to the set by reference', () => {
    const valueObject = {
      key1: 'value1',
      key2: 'value2',
      key3: [1, 2, 3, 4, 5],
    };
    const similarValueObject = {
      key2: 'value2',
      key1: 'value1',
      key3: [5, 2, 4, 3, 1],
    };

    set.add(valueObject);

    expect(set.has(similarValueObject)).toBeTruthy();
    expect(set.has(valueObject)).toBeTruthy();

    expect(set.get(similarValueObject)).toBe(valueObject);
    expect(set.get(valueObject)).toBe(valueObject);

    expect(set.use(similarValueObject)).toBe(valueObject);
    expect(set.use(valueObject)).toBe(valueObject);
  });

  it('should add an object to the set twice', () => {
    const valueObject1 = { key1: 'value1' };
    const valueObject2 = { key2: 'value2' };

    set.add(valueObject1);
    set.add(valueObject2);

    expect(set.has(valueObject1)).toBeTruthy();
    expect(set.has(valueObject2)).toBeTruthy();

    expect(set.get(valueObject1)).toBe(valueObject1);
    expect(set.get(valueObject2)).toBe(valueObject2);

    expect(set.use(valueObject1)).toBe(valueObject1);
    expect(set.use(valueObject2)).toBe(valueObject2);
  });

  it('should reuse a similar object', () => {
    const valueObject = { key1: 'value1' };
    const similarValueObject = { key1: 'value1' };

    set.add(valueObject);

    expect(set.use(similarValueObject)).toBe(valueObject);
    expect(set.get(similarValueObject)).toBe(valueObject);
  });

  it('should add an object to the set once', () => {
    const valueObject = { key1: 'value1' };
    const similarValueObject = { key1: 'value1' };

    set.add(valueObject);
    set.add(similarValueObject);

    expect(set.get(valueObject)).toBe(valueObject);
    expect(set.get(similarValueObject)).toBe(valueObject);
  });

  it('should garbage collect an object', (done) => {
    let valueObject: any = { key1: 'value1' };
    const similarValueObject = { key1: 'value1' };

    set.add(valueObject);

    expect(set.has(valueObject)).toBeTruthy();
    expect(set.has(similarValueObject)).toBeTruthy();

    expect(Array.from(set.values()).length).toBe(1);

    valueObject = undefined;

    setImmediate(() => {
      gc();

      try {
        expect(set.has(similarValueObject)).toBeFalsy();
        expect(set.get(similarValueObject)).toBeUndefined();

        expect(Array.from(set.values()).length).toBe(0);

        expect(set.use(similarValueObject)).toBe(similarValueObject);

        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should not garbage collect an object', (done) => {
    const valueObject: any = { key1: 'value1' };
    const similarValueObject = { key1: 'value1' };

    set.add(valueObject);

    expect(set.has(valueObject)).toBeTruthy();
    expect(set.has(similarValueObject)).toBeTruthy();

    expect(Array.from(set.values()).length).toBe(1);

    setImmediate(() => {
      gc();

      try {
        expect(set.has(valueObject)).toBeTruthy();
        expect(set.has(similarValueObject)).toBeTruthy();
        expect(set.get(valueObject)).toBe(valueObject);
        expect(set.get(similarValueObject)).toBe(valueObject);
        expect(set.use(valueObject)).toBe(valueObject);
        expect(set.use(similarValueObject)).toBe(valueObject);

        expect(Array.from(set.values()).length).toBe(1);

        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should delete an object from the set', () => {
    const valueObject = { key1: 'value1' };
    const similarValueObject = { key1: 'value1' };

    set.add(valueObject);

    expect(set.has(valueObject)).toBeTruthy();
    expect(set.has(similarValueObject)).toBeTruthy();
    expect(set.delete(similarValueObject)).toBeTruthy();
    expect(set.has(valueObject)).toBeFalsy();
    expect(set.has(similarValueObject)).toBeFalsy();
  });

  it('should clear the set', () => {
    const valueObject = { key1: 'value1' };
    const similarValueObject = { key1: 'value1' };

    set.add(valueObject);

    expect(set.has(valueObject)).toBeTruthy();
    expect(set.has(similarValueObject)).toBeTruthy();
    expect(Array.from(set.values()).length).toBe(1);

    set.clear();

    expect(set.has(valueObject)).toBeFalsy();
    expect(set.has(similarValueObject)).toBeFalsy();
    expect(Array.from(set.values()).length).toBe(0);
  });

  it('should return values', () => {
    const valueObject1 = { key1: 'value1' };
    const valueObject2 = { key2: 'value2' };

    set.add(valueObject1);
    set.add(valueObject2);

    const values = Array.from(set.values());

    expect(values.length).toBe(2);
    expect(values[0]).toBe(valueObject1);
    expect(values[1]).toBe(valueObject2);
  });
});
