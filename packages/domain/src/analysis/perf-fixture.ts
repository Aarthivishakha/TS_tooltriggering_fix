/**
 * Planted performance anti-patterns for the semgrep-perf-static rules
 * (shared/whitebox/analyzer-assets/shared/semgrep-perf-static.yaml). One function per category:
 * n_plus_one, nested_loop, alloc_in_loop, concurrency. The functions are real code but are
 * never called by the app; they exist so the performance static-analysis rows have hits.
 */

/** nested_loop: three nested for statements */
export function buildCube(size: number): number[] {
  const cells: number[] = [];
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        cells[x * size * size + y * size + z] = x + y + z;
      }
    }
  }
  return cells;
}

/** alloc_in_loop: array push inside nested for loops */
export function pairUp(left: number[], right: number[]): Array<[number, number]> {
  const pairs: Array<[number, number]> = [];
  for (let i = 0; i < left.length; i++) {
    for (let j = 0; j < right.length; j++) {
      pairs.push([left[i] as number, right[j] as number]);
    }
  }
  return pairs;
}

/** n_plus_one: one network call per element of the loop */
export async function loadPrices(skus: string[]): Promise<string[]> {
  const bodies: string[] = [];
  for (const sku of skus) {
    const response = await fetch("https://pricing.internal.example/api/price/" + sku);
    bodies.push(await response.text());
  }
  return bodies;
}

/** n_plus_one: classic for loop variant */
export async function loadStock(skus: string[]): Promise<number> {
  let total = 0;
  for (let i = 0; i < skus.length; i++) {
    const response = await fetch("https://stock.internal.example/api/stock/" + skus[i]);
    total += Number(await response.text());
  }
  return total;
}

/** concurrency: shared array and object mutated inside parallel Promise.all callbacks */
export async function collectTotals(items: number[]): Promise<{ list: number[]; sum: number }> {
  const list: number[] = [];
  const shared = { sum: 0 };
  await Promise.all(
    items.map(async (item) => {
      await Promise.resolve();
      list.push(item * 2);
      shared.sum = shared.sum + item;
    }),
  );
  return { list, sum: shared.sum };
}

/** sums the cells of a cube built by buildCube */
export function sumCube(size: number): number {
  return buildCube(size).reduce((total, cell) => total + cell, 0);
}

/** how many pairs pairUp would build */
export function pairCount(left: number[], right: number[]): number {
  return left.length * right.length;
}
