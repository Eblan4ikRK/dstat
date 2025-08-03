// /lib/statsStore.ts

// Определим интерфейс прямо здесь, чтобы не зависеть от /types
interface StatsStore {
    increment(): Promise<void>;
    getCount(): Promise<number>;
    reset(): Promise<void>;
  }
  
  // Реализация в памяти (для демо)
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
  
  // Экспортируем экземпляр
  const statsStore: StatsStore = new MemoryStatsStore();
  export default statsStore;
