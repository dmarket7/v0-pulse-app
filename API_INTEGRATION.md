# API Integration Documentation

## Overview

This document describes the integration between the Pulse mobile app and the backend API running at `http://127.0.0.1:8000`. The integration includes both public and protected endpoints with proper TypeScript types and error handling.

## API Service

The main API service is located in `src/services/api.ts` and provides a centralized way to communicate with the backend.

### Configuration

```typescript
const API_BASE_URL = "http://127.0.0.1:8000";
```

### Authentication

The API service supports JWT token authentication:

```typescript
apiService.setAuthToken(token); // Set auth token
apiService.clearAuthToken(); // Clear auth token
```

## Public Endpoints

These endpoints are accessible without authentication and are linked from the Welcome screen.

### 1. Health Tips (`/health-tips`)

**Screen**: `HealthTipsScreen.tsx`
**Navigation**: Welcome → Health Tips

**Features**:

- Filter by category: nutrition, hydration, recovery, mental_health, injury_prevention
- Filter by age group: 6-8, 9-12, 13-15, 16-18
- Real-time filtering with API calls
- Loading states and error handling

**API Usage**:

```typescript
const tips = await apiService.getHealthTips(category?, ageGroup?);
```

### 2. Training Guidelines (`/training-guidelines`)

**Screen**: `TrainingGuidelinesScreen.tsx`
**Navigation**: Welcome → Training Guidelines

**Features**:

- Filter by sport: soccer, basketball, tennis, swimming, track, other
- Filter by age group: 6-8, 9-12, 13-15, 16-18
- Displays max hours per week, rest days, and detailed guidelines
- Visual stats display

**API Usage**:

```typescript
const guidelines = await apiService.getTrainingGuidelines(sport?, ageGroup?);
```

### 3. Readiness Check (`/readiness-check`)

**Screen**: `ReadinessCheckScreen.tsx`
**Navigation**: Welcome → Readiness Check

**Features**:

- Interactive sliders for 3 WHOOP-based factors:
  - Recovery Score (0-100%)
  - Strain Score (0-21 scale)
  - Sleep Performance (0-100%)
- Real-time readiness assessment based on WHOOP methodology
- Color-coded results (green/yellow/red)
- Personalized recommendations and tips

**API Usage**:

```typescript
const result = await apiService.checkReadiness({
  recovery_score: 50,
  strain_score: 10,
  sleep_performance: 80,
});
```

## Protected Endpoints

These endpoints require authentication and are used within the authenticated app sections.

### Authentication Endpoints

- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/signin` - User login
- `POST /api/v1/auth/signout` - User logout
- `POST /api/v1/auth/password-reset` - Password reset request
- `GET /api/v1/auth/me` - Get current user profile
- `PUT /api/v1/auth/me` - Update user profile

### Health Logs Endpoints

- `POST /api/v1/health-logs/` - Create health log entry
- `GET /api/v1/health-logs/{child_id}` - Get health logs for a child

## TypeScript Types

All API responses are properly typed:

```typescript
interface HealthTip {
  id: number;
  title: string;
  content: string;
  category: string;
  age_group: string;
}

interface TrainingGuideline {
  sport: SportType;
  age_group: string;
  max_hours_per_week: number;
  rest_days_per_week: number;
  guidelines: string[];
}

interface ReadinessResponse {
  status: "green" | "yellow" | "red";
  confidence: number;
  recommendation: string;
  factors_analysis: Record<string, any>;
  tips: string[];
}
```

## Navigation Integration

The public API features are integrated into the app navigation:

1. **Welcome Screen**: Contains cards linking to public features
2. **Stack Navigation**: All screens are properly registered
3. **Back Navigation**: All screens have back buttons to return to Welcome

## Error Handling

The API service includes comprehensive error handling:

- Network errors
- HTTP status errors
- JSON parsing errors
- User-friendly error messages via Alert dialogs

## Usage Examples

### Testing the API

```bash
# Health Tips
curl http://127.0.0.1:8000/health-tips

# Training Guidelines
curl http://127.0.0.1:8000/training-guidelines

# Readiness Check
curl -X POST http://127.0.0.1:8000/readiness-check \
  -H "Content-Type: application/json" \
  -d '{"recovery_score": 50, "strain_score": 10, "sleep_performance": 80}'
```

### Using in Components

```typescript
import { apiService } from "../services/api";

// In a component
const [healthTips, setHealthTips] = useState<HealthTip[]>([]);

useEffect(() => {
  const fetchTips = async () => {
    try {
      const tips = await apiService.getHealthTips();
      setHealthTips(tips);
    } catch (error) {
      Alert.alert("Error", "Failed to load health tips");
    }
  };

  fetchTips();
}, []);
```

## Dependencies

The integration uses these key dependencies:

- `@react-native-community/slider` - For readiness check sliders
- `@react-navigation/native` - For navigation
- `@expo/vector-icons` - For icons
- `expo-linear-gradient` - For gradients

## Development

To run the app with API integration:

1. Ensure the backend is running at `http://127.0.0.1:8000`
2. Start the Expo development server: `npm start`
3. The public features are accessible from the Welcome screen
4. Authentication features are available through the login flow

## Future Enhancements

Potential improvements for the API integration:

1. **Offline Support**: Cache API responses for offline viewing
2. **Real-time Updates**: WebSocket integration for live data
3. **Push Notifications**: Integration with backend notification system
4. **Advanced Filtering**: More sophisticated filtering options
5. **Data Visualization**: Charts and graphs for health data
6. **Export Features**: PDF/CSV export of health logs and recommendations
