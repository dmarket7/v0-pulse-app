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
  on_period_today?: boolean;
  has_injury?: boolean;
  injury_severity?: string;
  injury_type?: string;
  injury_location?: string;
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
  gender?: 'male' | 'female' | 'non_binary' | 'prefer_not_to_answer';
  date_of_birth?: string; // Date in YYYY-MM-DD format
  track_periods?: boolean;
  email?: string;
  password?: string;
  create_auth_account: boolean;
}

export interface CreateChildWithAuthRequest {
  name: string;
  gender?: 'male' | 'female' | 'non_binary' | 'prefer_not_to_answer';
  date_of_birth?: string; // Date in YYYY-MM-DD format
  track_periods?: boolean;
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
  gender?: 'male' | 'female' | 'non_binary' | 'prefer_not_to_answer';
  date_of_birth?: string;
  track_periods?: boolean;
  email?: string;
  auth_user_id?: string;
  parent_id: string;
  created_at: string;
  updated_at: string;
  current_team?: {
    team_id: string;
    team_name: string;
    positions?: string[];
  };
}

export type SportType = 'soccer' | 'basketball' | 'tennis' | 'swimming' | 'track' | 'other';

// Team-related types
export interface TeamCreate {
  name: string;
}

export interface TeamRead {
  id: string;
  name: string;
  created_by: string;
  creator_name?: string;
  archived: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TeamResponse {
  id: string;
  name: string;
  created_by: string;
  message: string;
}

export interface TeamUpdate {
  name?: string;
}

export interface RosterPlayer {
  child_id: string;
  child_name: string;
  positions?: string[];
}

export interface TeamRoster {
  team_id: string;
  team_name: string;
  players: RosterPlayer[];
  coaches: any[];
}

export interface AddPlayerToTeam {
  child_id: string;
  positions?: string[];
}

export interface RemovePlayerFromTeam {
  child_id: string;
}

export interface CoachAssignment {
  coach_id: string;
}

export interface PlayerPosition {
  child_id: string;
  positions: string[];
}

export interface TeamArchiveResponse {
  id: string;
  name: string;
  archived: boolean;
  message: string;
}

// Invitation-related types
export interface InvitationRequest {
  email: string;
  positions?: string[];
  message?: string;
}

export interface PlayerInvitation {
  id: string;
  team_id: string;
  team_name: string;
  invited_email: string;
  invited_by: string;
  child_id?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  positions?: string[];
  message?: string;
  created_at: string;
  expires_at: string;
}

export interface ReceivedInvitation {
  id: string;
  team_name: string;
  coach_name: string;
  positions?: string[];
  message?: string;
  created_at: string;
  expires_at: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export interface InvitationResponse {
  accept: boolean;
  child_id?: string;
}

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

  async getHealthLogByDate(childId: string, date: string): Promise<HealthLogRead | null> {
    try {
      const healthLogs = await this.getHealthLogs(childId);
      return healthLogs.find(log => log.date === date) || null;
    } catch (error) {
      console.error('Failed to get health log by date:', error);
      return null;
    }
  }

  async deleteHealthLog(logId: string): Promise<any> {
    return this.request(`/api/v1/health-logs/${logId}`, {
      method: 'DELETE',
    });
  }

  async updateHealthLog(logId: string, data: Partial<HealthLogCreate>): Promise<HealthLogRead> {
    // Since the backend may not have a PUT endpoint, we'll use delete and recreate
    try {
      // Remove child_id from update data since it's implied by the log ID
      // This includes all other fields: date, on_period_today, has_injury,
      // injury_severity, injury_type, injury_location, notes
      const { child_id, ...updateData } = data;

      // First try the PUT method (in case it exists)
      return await this.request(`/api/v1/health-logs/${logId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    } catch (error: any) {
      // If PUT fails with 404 or 405, try delete and recreate
      if (error.status === 404 || error.status === 405 || error.status === 422) {
        console.log('PUT endpoint not available, using delete and recreate approach');

        // Delete the existing log
        await this.deleteHealthLog(logId);

        // Create a new log with the updated data (including child_id for creation)
        return await this.createHealthLog(data as HealthLogCreate);
      }

      // Re-throw other errors
      throw error;
    }
  }

  async getChildIdFromAuth(authUserId: string): Promise<{ child_id: string; }> {
    return this.request(`/api/v1/health-logs/child-id-from-auth/${authUserId}`);
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

  // Team endpoints
  async getMyTeams(): Promise<TeamRead[]> {
    return this.request('/api/v1/teams/');
  }

  async createTeam(data: TeamCreate): Promise<TeamResponse> {
    return this.request('/api/v1/teams/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTeam(teamId: string): Promise<TeamRead> {
    return this.request(`/api/v1/teams/${teamId}`);
  }

  async updateTeam(teamId: string, data: TeamUpdate): Promise<TeamResponse> {
    return this.request(`/api/v1/teams/${teamId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getTeamRoster(teamId: string): Promise<TeamRoster> {
    return this.request(`/api/v1/teams/${teamId}/roster`);
  }

  async addPlayerToTeam(teamId: string, data: AddPlayerToTeam): Promise<any> {
    return this.request(`/api/v1/teams/${teamId}/players`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removePlayerFromTeam(teamId: string, data: RemovePlayerFromTeam): Promise<any> {
    return this.request(`/api/v1/teams/${teamId}/players`, {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  }

  async addCoachToTeam(teamId: string, data: CoachAssignment): Promise<any> {
    return this.request(`/api/v1/teams/${teamId}/coaches`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePlayerPositions(teamId: string, childId: string, data: PlayerPosition): Promise<any> {
    return this.request(`/api/v1/teams/${teamId}/players/${childId}/positions`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async archiveTeam(teamId: string): Promise<TeamArchiveResponse> {
    return this.request(`/api/v1/teams/${teamId}/archive`, {
      method: 'POST',
    });
  }

  async unarchiveTeam(teamId: string): Promise<TeamArchiveResponse> {
    return this.request(`/api/v1/teams/${teamId}/unarchive`, {
      method: 'POST',
    });
  }

  async getArchivedTeams(): Promise<TeamRead[]> {
    return this.request('/api/v1/teams/archived');
  }

  // Invitation methods

  // Coach methods for sending and managing invitations
  async createTeamInvitation(teamId: string, data: InvitationRequest): Promise<PlayerInvitation> {
    return this.request(`/api/v1/teams/${teamId}/invitations`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTeamInvitations(teamId: string, includeExpired: boolean = false): Promise<PlayerInvitation[]> {
    const params = includeExpired ? '?include_expired=true' : '';
    return this.request(`/api/v1/teams/${teamId}/invitations${params}`);
  }

  async cancelTeamInvitation(teamId: string, invitationId: string): Promise<void> {
    return this.request(`/api/v1/teams/${teamId}/invitations/${invitationId}`, {
      method: 'DELETE',
    });
  }

  // Parent methods for receiving and responding to invitations
  async getReceivedInvitations(includeExpired: boolean = false): Promise<ReceivedInvitation[]> {
    const params = includeExpired ? '?include_expired=true' : '';
    return this.request(`/api/v1/invitations/received${params}`);
  }

  async respondToInvitation(invitationId: string, response: InvitationResponse): Promise<any> {
    return this.request(`/api/v1/invitations/${invitationId}/respond`, {
      method: 'PUT',
      body: JSON.stringify(response),
    });
  }

  async getChildInvitations(childId: string, includeExpired: boolean = false): Promise<ReceivedInvitation[]> {
    const params = includeExpired ? '?include_expired=true' : '';
    return this.request(`/api/v1/children/${childId}/invitations${params}`);
  }
}

export const apiService = new ApiService();