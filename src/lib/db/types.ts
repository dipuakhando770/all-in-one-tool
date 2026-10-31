// Minimal D1-compatible interface used across repositories.
export type D1PreparedStatement = {
  bind: (...values: any[]) => D1PreparedStatement;
  all: <T = any>() => Promise<{ results: T[]; success: boolean; meta?: any }>;
  first: <T = any>(colName?: string) => Promise<T | null>;
  run: () => Promise<{ success: boolean; meta?: any }>;
};

export type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
  batch: (statements: D1PreparedStatement[]) => Promise<any[]>;
  exec: (query: string) => Promise<any>;
};

export type Db = D1Database | null;
