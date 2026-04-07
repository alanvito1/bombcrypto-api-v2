/**
 * Map auto sort by value
 */
export default class SortedMap<K, V> {
    #map: Map<K, V>;
    #sortedKeys: K[];
    #comparator: (a: V, b: V) => number;

    /**
     * @param comparator
     * @example
     * Sort DESC: (a, b) => b - a
     * Sort ASC: (a, b) => a - b
     */
    constructor(comparator: (a: V, b: V) => number) {
        this.#map = new Map<K, V>();
        this.#sortedKeys = [];
        this.#comparator = comparator;
    }

    set(key: K, value: V): void {
        if (this.#map.has(key)) {
            // Remove the existing key from #sortedKeys
            const index = this.#sortedKeys.indexOf(key);
            if (index !== -1) {
                this.#sortedKeys.splice(index, 1);
            }
        }

        this.#map.set(key, value);
        this.#sortedKeys.push(key);
        this.#sortedKeys.sort((a, b) => this.#comparator(this.#map.get(a)!, this.#map.get(b)!));
    }

    get(key: K): V | undefined {
        return this.#map.get(key);
    }

    delete(key: K): boolean {
        if (this.#map.has(key)) {
            this.#map.delete(key);
            const index = this.#sortedKeys.indexOf(key);
            if (index !== -1) {
                this.#sortedKeys.splice(index, 1);
            }
            return true;
        }
        return false;
    }

    has(key: K): boolean {
        return this.#map.has(key);
    }

    values(): V[] {
        return this.#sortedKeys.map(key => this.#map.get(key)!);
    }

    keys(): K[] {
        return [...this.#sortedKeys];
    }

    entries(): [K, V][] {
        return this.#sortedKeys.map(key => [key, this.#map.get(key)!]);
    }

    size(): number {
        return this.#map.size;
    }

    clear(): void {
        this.#map.clear();
        this.#sortedKeys = [];
    }
}