// Minimal D1-compatible interface used across repositories.
export type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  all: <T = unknown>() => Promise<{ results: T[]; success: boolean; meta?: unknown }>;
  first: <T = unknown>(colName?: string) => Promise<T | null>;
  run: () => Promise<{ success: boolean; meta?: unknown }>;
};

export type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
  batch: (statements: D1PreparedStatement[]) => Promise<unknown[]>;
  exec: (query: string) => Promise<unknown>;
};

export type Db = D1Database | null;
