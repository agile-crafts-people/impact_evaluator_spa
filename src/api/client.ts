import type { 
  TestRun,
  TestRunInput,
  TestRunUpdate,

  TestData,
  TestDataInput,
  TestDataUpdate,

  Grade,
  GradeInput,

  Profile,

  DevLoginRequest, 
  DevLoginResponse,
  ConfigResponse,
  Error,
  InfiniteScrollParams,
  InfiniteScrollResponse
} from './types'

const API_BASE = '/api'

function getDevLoginUrl(): string {
  return '/dev-login'
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Error
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token')
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorData: Error | null = null
    try {
      errorData = await response.json()
    } catch {
      // Ignore JSON parse errors
    }
    
    // Handle 401 Unauthorized - clear invalid token and redirect to login
    if (response.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('token_expires_at')
      // Redirect to login page, preserving current path for post-login redirect
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
    }
    
    throw new ApiError(
      errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData || undefined
    )
  }

  // Handle empty responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T
  }

  return response.json()
}

export const api = {
  // Authentication
  async devLogin(payload?: DevLoginRequest): Promise<DevLoginResponse> {
    const url = getDevLoginUrl()
    const token = localStorage.getItem('access_token')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload || {}),
    })

    if (!response.ok) {
      let errorData: Error | null = null
      try {
        errorData = await response.json()
      } catch {
        // Ignore JSON parse errors
      }
      throw new ApiError(
        errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData || undefined
      )
    }

    return response.json()
  },

  // Config
  async getConfig(): Promise<ConfigResponse> {
    return request<ConfigResponse>('/config')
  },

  // Control endpoints
  // 🎯 API methods use InfiniteScrollParams and InfiniteScrollResponse types
  // These types are compatible with spa_utils useInfiniteScroll composable

  async getTestRuns(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<TestRun>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<TestRun>>(`/testrun${query ? `?${query}` : ''}`)
  },

  async getTestRun(testrunId: string): Promise<TestRun> {
    return request<TestRun>(`/testrun/${testrunId}`)
  },

  async createTestRun(data: TestRunInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/testrun', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateTestRun(testrunId: string, data: TestRunUpdate): Promise<TestRun> {
    return request<TestRun>(`/testrun/${testrunId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },


  async getTestDatas(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<TestData>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<TestData>>(`/testdata${query ? `?${query}` : ''}`)
  },

  async getTestData(testdataId: string): Promise<TestData> {
    return request<TestData>(`/testdata/${testdataId}`)
  },

  async createTestData(data: TestDataInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/testdata', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateTestData(testdataId: string, data: TestDataUpdate): Promise<TestData> {
    return request<TestData>(`/testdata/${testdataId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },



  // Create endpoints

  async getGrades(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Grade>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Grade>>(`/grade${query ? `?${query}` : ''}`)
  },

  async getGrade(gradeId: string): Promise<Grade> {
    return request<Grade>(`/grade/${gradeId}`)
  },

  async createGrade(data: GradeInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/grade', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },



  // Consume endpoints

  async getProfiles(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Profile>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Profile>>(`/profile${query ? `?${query}` : ''}`)
  },

  async getProfile(profileId: string): Promise<Profile> {
    return request<Profile>(`/profile/${profileId}`)
  },


}

export { ApiError }
