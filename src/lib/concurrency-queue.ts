type queueTask<T> = () => Promise<T> | T;

export class ConcurrencyQueue {
  private readonly concurrency: number;
  private activeCount = 0;
  private readonly queue: Array<() => void> = [];

  constructor({concurrency}: {concurrency: number}) {
    if (!Number.isInteger(concurrency) || concurrency < 1) {
      throw new Error('Concurrency must be a positive integer');
    }
    this.concurrency = concurrency;
  }

  add<T>(task: queueTask<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push(() => {
        this.run(task).then(resolve, reject);
      });
      this.next();
    });
  }

  async addAll<T>(tasks: Array<queueTask<T>>): Promise<T[]> {
    return await Promise.all(tasks.map((task) => this.add(task)));
  }

  private async run<T>(task: queueTask<T>): Promise<T> {
    this.activeCount += 1;
    try {
      return await task();
    } finally {
      this.activeCount -= 1;
      this.next();
    }
  }

  private next(): void {
    while (this.activeCount < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift() as () => void;
      task();
    }
  }
}
