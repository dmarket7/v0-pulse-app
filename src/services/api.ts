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

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.message || `HTTP error! status: ${response.status}`,
          status: response.status,
          details: errorData,
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
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
}

export const apiService = new ApiService();