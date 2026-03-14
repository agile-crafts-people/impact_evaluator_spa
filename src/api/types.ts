// Type definitions based on OpenAPI spec

export interface Error {
  error: string
}

export interface Breadcrumb {
  from_ip: string
  by_user: string
  at_time: string
  correlation_id: string
}


// TestRun Domain
export interface TestRun {
  _id: string
  name: string
  description?: string
  status?: 'active' | 'archived'
  created: Breadcrumb
  saved: Breadcrumb
}

export interface TestRunInput {
  name: string
  description?: string
  status?: 'active' | 'archived'
}

export interface TestRunUpdate {
  name?: string
  description?: string
  status?: 'active' | 'archived'
}

// TestData Domain
export interface TestData {
  _id: string
  name: string
  description?: string
  status?: 'active' | 'archived'
  created: Breadcrumb
  saved: Breadcrumb
}

export interface TestDataInput {
  name: string
  description?: string
  status?: 'active' | 'archived'
}

export interface TestDataUpdate {
  name?: string
  description?: string
  status?: 'active' | 'archived'
}


// Grade Domain
export interface Grade {
  _id: string
  name: string
  description?: string
  status?: string
  created: Breadcrumb
}

export interface GradeInput {
  name: string
  description?: string
  status?: string
}


// Profile Domain
export interface Profile {
  _id: string
  name: string
  description?: string
  status?: string
}


// Authentication
export interface DevLoginRequest {
  subject?: string
  roles?: string[]
}

export interface DevLoginResponse {
  access_token: string
  token_type: string
  expires_at: string
  subject: string
  roles: string[]
}

// Configuration
export interface ConfigResponse {
  config_items: unknown[]
  versions: unknown[]
  enumerators: unknown[]
  token?: {
    claims?: Record<string, unknown>
  }
}

// Infinite Scroll
export interface InfiniteScrollParams {
  name?: string
  after_id?: string
  limit?: number
  sort_by?: string
  order?: 'asc' | 'desc'
}

export interface InfiniteScrollResponse<T> {
  items: T[]
  limit: number
  has_more: boolean
  next_cursor: string | null
}
