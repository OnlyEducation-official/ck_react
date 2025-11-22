// Generic wrapper for Strapi REST API v4/v5
export interface StrapiResponse<T> {
  data: T;
  meta: StrapiMeta;
}

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

// Single item
export interface StrapiSingle<T> {
  id: number;
  attributes: T;
}

// Array of items
export type StrapiCollection<T> = StrapiSingle<T>[];

// Generic relation types
export interface StrapiRelationSingle<T> {
  data: StrapiSingle<T> | null;
}

export interface StrapiRelationMany<T> {
  data: StrapiSingle<T>[];
}
