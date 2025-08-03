// /lib/statsStore.ts
import type { StatsStore } from '../types';

class MemoryStatsStore implements StatsStore {
  private requestCount: number = 0;

  async increment(): Promise<void> {
    this.requestCount++;
  }

  async getCount(): Promise<number> {
    return this.requestCount;
  }

  async reset(): Promise<void> {
    this.requestCount = 0;
  }
}

const statsStore: StatsStore = new MemoryStatsStore();
export default statsStore;