# Environment Configuration

This project uses environment variables to configure the API base URL and other settings.

## Setup

1. Create a `.env` file in the root directory of the project
2. Add the following environment variables:

```bash
# API Configuration
# The base URL for the backend API
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

# For production, you might use something like:
# EXPO_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

## Important Notes

- Environment variables in Expo must be prefixed with `EXPO_PUBLIC_` to be accessible in client code
- The `.env` file is ignored by git for security reasons
- If no environment variable is set, the app will default to `http://127.0.0.1:8000`

## Available Environment Variables

| Variable                   | Description                  | Default Value           |
| -------------------------- | ---------------------------- | ----------------------- |
| `EXPO_PUBLIC_API_BASE_URL` | Base URL for the backend API | `http://127.0.0.1:8000` |
