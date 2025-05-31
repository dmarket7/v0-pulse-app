import { config } from '../config/environment';

const API_BASE_URL = config.API_BASE_URL;

// Types based on the API schema
export interface HealthTip {
  id: number;
  title: string;
  content: string;
  category: string;
  age_group: string;
}

export interface TrainingGuideline {
  sport: SportType;
  age_group: string;
  max_hours_per_week: number;
  rest_days_per_week: number;
  guidelines: string[];
}

export interface ReadinessFactors {
  sleep_hours: number;
  stress_level: number;
  muscle_soreness: number;
  energy_level: number;
  hydration_level: number;
}

export interface ReadinessResponse {
  status: 'green' | 'yellow' | 'red';
  confidence: number;
  recommendation: string;
  factors_analysis: Record<string, any>;
  tips: string[];
}

export interface SignUpRequest {
  email: string;
  password: string;
  full_name?: string;
  role?: 'parent' | 'coach';
  metadata?: Record<string, any>;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  email?: string;
  email_confirmed_at?: string;
  created_at?: string;
  updated_at?: string;
  user_metadata?: Record<string, any>;
}

export interface HealthLogCreate {
  child_id: string;
  date: string;
  menstruation_started?: boolean;
  period_flow?: string;
  cramps?: boolean;
  flexibility_level: string;
  energy_level: string;
  mood: string;
  notes?: string;
}

export interface HealthLogRead extends HealthLogCreate {
  id: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Child account creation types
export interface CreateChildRequest {
  name: string;
  email?: string;
  password?: string;
  create_auth_account: boolean;
}

export interface CreateChildWithAuthRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateChildResponse {
  message: string;
  child_id?: string;
  email?: string;
}

export interface Child {
  id: string;
  name: string;
  email?: string;
  auth_user_id?: string;
  parent_id: string;
  created_at: string;
  updated_at: string;
}

export type SportType = 'soccer' | 'basketball' | 'tennis' | 'swimming' | 'track' | 'other';

class ApiService {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  // Create a timeout signal that's compatible with React Native
  private createTimeoutSignal(timeoutMs: number): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => {
      controller.abort();
    }, timeoutMs);
    return controller.signal;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    // Log the request URL in development or if there are issues
    if (__DEV__) {
      console.log(`[API] ${options.method || 'GET'} ${url}`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        // Add timeout for better error handling - using custom timeout for React Native compatibility
        signal: this.createTimeoutSignal(30000), // 30 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.message || `HTTP error! status: ${response.status}`,
          status: response.status,
          details: errorData,
        };

        // Enhanced error logging
        console.error(`[API Error] ${response.status} ${url}:`, error);
        throw error;
      }

      return await response.json();
    } catch (error) {
      // Enhanced error handling with network-specific messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error(`[Network Error] Failed to connect to API: ${url}`);
        console.error('This usually indicates:');
        console.error('1. The API server is down');
        console.error('2. Network connectivity issues');
        console.error('3. Incorrect API base URL');
        console.error('4. CORS issues (web only)');
        console.error('Current API base URL:', this.baseUrl);
      } else if (error instanceof Error && error.name === 'AbortError') {
        console.error(`[Timeout Error] Request to ${url} timed out after 30 seconds`);
      } else {
        console.error(`[API Request Failed] ${url}:`, error);
      }

      throw error;
    }
  }

  // Public endpoints
  async getRoot(): Promise<any> {
    return this.request('/');
  }

  async healthCheck(): Promise<any> {
    return this.request('/health');
  }

  async getHealthTips(category?: string, ageGroup?: string): Promise<HealthTip[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (ageGroup) params.append('age_group', ageGroup);

    const query = params.toString();
    return this.request(`/health-tips${query ? `?${query}` : ''}`);
  }

  async getTrainingGuidelines(sport?: SportType, ageGroup?: string): Promise<TrainingGuideline[]> {
    const params = new URLSearchParams();
    if (sport) params.append('sport', sport);
    if (ageGroup) params.append('age_group', ageGroup);

    const query = params.toString();
    return this.request(`/training-guidelines${query ? `?${query}` : ''}`);
  }

  async checkReadiness(factors: ReadinessFactors): Promise<ReadinessResponse> {
    return this.request('/readiness-check', {
      method: 'POST',
      body: JSON.stringify(factors),
    });
  }

  async getSupportedSports(): Promise<any> {
    return this.request('/sports');
  }

  async getAgeGroups(): Promise<any> {
    return this.request('/age-groups');
  }

  // Authentication endpoints
  async signUp(data: SignUpRequest): Promise<UserResponse> {
    return this.request('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signIn(data: SignInRequest): Promise<SignInResponse> {
    return this.request('/api/v1/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signOut(): Promise<any> {
    return this.request('/api/v1/auth/signout', {
      method: 'POST',
    });
  }

  async requestPasswordReset(email: string): Promise<any> {
    return this.request('/api/v1/auth/password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request('/api/v1/auth/me');
  }

  async updateUserProfile(data: { email?: string; user_metadata?: Record<string, any>; }): Promise<UserResponse> {
    return this.request('/api/v1/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Health logs endpoints
  async createHealthLog(data: HealthLogCreate): Promise<HealthLogRead> {
    return this.request('/api/v1/health-logs/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getHealthLogs(childId: string): Promise<HealthLogRead[]> {
    return this.request(`/api/v1/health-logs/${childId}`);
  }

  // Child account endpoints
  async createChild(data: CreateChildRequest): Promise<CreateChildResponse> {
    return this.request('/api/v1/children/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createChildWithAuth(data: CreateChildWithAuthRequest): Promise<CreateChildResponse> {
    return this.request('/api/v1/children/with-auth', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getChildren(): Promise<Child[]> {
    return this.request('/api/v1/children/');
  }

  async updateChild(childId: string, data: Partial<CreateChildRequest>): Promise<Child> {
    return this.request(`/api/v1/children/${childId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteChild(childId: string): Promise<any> {
    return this.request(`/api/v1/children/${childId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();