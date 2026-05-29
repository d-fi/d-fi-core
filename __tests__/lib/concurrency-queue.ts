import {expect, test} from 'bun:test';
import {ConcurrencyQueue} from '../../src/lib/concurrency-queue';

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (err: Error) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return {promise, resolve, reject};
};

test('ConcurrencyQueue respects concurrency limit', async () => {
  const queue = new ConcurrencyQueue({concurrency: 2});
  const first = deferred<number>();
  const second = deferred<number>();
  const third = deferred<number>();
  let running = 0;
  let maxRunning = 0;

  const addTask = (defer: ReturnType<typeof deferred<number>>) =>
    queue.add(async () => {
      running += 1;
      maxRunning = Math.max(maxRunning, running);
      const value = await defer.promise;
      running -= 1;
      return value;
    });

  const result = Promise.all([addTask(first), addTask(second), addTask(third)]);

  await Promise.resolve();
  expect(maxRunning).toBe(2);

  first.resolve(1);
  await Promise.resolve();
  expect(maxRunning).toBe(2);

  second.resolve(2);
  third.resolve(3);

  expect(await result).toEqual([1, 2, 3]);
  expect(maxRunning).toBe(2);
});

test('ConcurrencyQueue addAll returns task results in input order', async () => {
  const queue = new ConcurrencyQueue({concurrency: 2});

  expect(await queue.addAll([async () => 'first', async () => 'second', async () => 'third'])).toEqual([
    'first',
    'second',
    'third',
  ]);
});

test('ConcurrencyQueue propagates task errors', async () => {
  const queue = new ConcurrencyQueue({concurrency: 1});
  const err = new Error('task failed');

  try {
    await queue.add(async () => Promise.reject(err));
    expect.unreachable();
  } catch (err: any) {
    expect(err.message).toBe('task failed');
  }
});

test('ConcurrencyQueue continues after a rejected task', async () => {
  const queue = new ConcurrencyQueue({concurrency: 1});
  const first = queue.add(async () => Promise.reject(new Error('task failed')));
  const second = queue.add(async () => 'next');

  try {
    await first;
    expect.unreachable();
  } catch (err: any) {
    expect(err.message).toBe('task failed');
  }
  expect(await second).toBe('next');
});

test('ConcurrencyQueue rejects invalid concurrency values', () => {
  expect(() => new ConcurrencyQueue({concurrency: 0})).toThrow('Concurrency must be a positive integer');
  expect(() => new ConcurrencyQueue({concurrency: 1.5})).toThrow('Concurrency must be a positive integer');
});
