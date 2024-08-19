class Node {
  value;
  next;

  constructor(value) {
    this.value = value;
  }
}

export class Queue {
  #head;
  #tail;
  #size;

  constructor() {
    this.clear();
  }

  enqueue(value) {
    const node = new Node(value);

    if (this.#head) {
      this.#tail.next = node;
      this.#tail = node;
    } else {
      this.#head = node;
      this.#tail = node;
    }

    this.#size++;
  }

  dequeue() {
    const current = this.#head;
    if (!current) {
      return;
    }

    this.#head = this.#head.next;
    this.#size--;
    return current.value;
  }

  peek() {
    if (!this.#head) {
      return;
    }

    return this.#head.value;

    // TODO: Node.js 18.
    // return this.#head?.value;
  }

  clear() {
    this.#head = undefined;
    this.#tail = undefined;
    this.#size = 0;
  }

  get size() {
    return this.#size;
  }

  *[Symbol.iterator]() {
    let current = this.#head;

    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}

export default function pLimit(concurrency) {
  validateConcurrency(concurrency);

  const queue = new Queue();
  let activeCount = 0;

  const resumeNext = () => {
    if (activeCount < concurrency && queue.size > 0) {
      queue.dequeue();
      // Since `pendingCount` has been decreased by one, increase `activeCount` by one.
      activeCount++;
    }
  };

  const next = () => {
    activeCount--;

    resumeNext();
  };

  const run = async (function_, resolve, arguments_) => {
    const result = (async () => function_(...arguments_))();

    resolve(result);

    try {
      await result;
    } catch {}

    next();
  };

  const enqueue = (function_, resolve, arguments_) => {
    // Queue `internalResolve` instead of the `run` function
    // to preserve asynchronous context.
    new Promise((internalResolve) => {
      queue.enqueue(internalResolve);
    }).then(run.bind(undefined, function_, resolve, arguments_));

    (async () => {
      // This function needs to wait until the next microtask before comparing
      // `activeCount` to `concurrency`, because `activeCount` is updated asynchronously
      // after the `internalResolve` function is dequeued and called. The comparison in the if-statement
      // needs to happen asynchronously as well to get an up-to-date value for `activeCount`.
      await Promise.resolve();

      if (activeCount < concurrency) {
        resumeNext();
      }
    })();
  };

  const generator = (function_, ...arguments_) =>
    new Promise((resolve) => {
      enqueue(function_, resolve, arguments_);
    });

  Object.defineProperties(generator, {
    activeCount: {
      get: () => activeCount,
    },
    pendingCount: {
      get: () => queue.size,
    },
    clearQueue: {
      value() {
        queue.clear();
      },
    },
    concurrency: {
      get: () => concurrency,

      set(newConcurrency) {
        validateConcurrency(newConcurrency);
        concurrency = newConcurrency;

        queueMicrotask(() => {
          // eslint-disable-next-line no-unmodified-loop-condition
          while (activeCount < concurrency && queue.size > 0) {
            resumeNext();
          }
        });
      },
    },
  });

  return generator;
}

function validateConcurrency(concurrency) {
  if (
    !(
      (Number.isInteger(concurrency) ||
        concurrency === Number.POSITIVE_INFINITY) &&
      concurrency > 0
    )
  ) {
    throw new TypeError('Expected `concurrency` to be a number from 1 and up');
  }
}
