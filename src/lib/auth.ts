import { apiClient } from './api';

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: string;
  is_active: boolean;
  is_email_verified: boolean;
}

class AuthService {
  async login(email: string, password: string): Promise<AuthTokens> {
    const response = await apiClient.login(email, password);
    const tokens = response.data;
    this.setTokens(tokens);
    return tokens;
  }

  async register(
    email: string,
    username: string,
    fullName: string,
    password: string
  ): Promise<User> {
    const response = await apiClient.register(email, username, fullName, password);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.getCurrentUser();
    return response.data;
  }

  setTokens(tokens: AuthTokens) {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export const authService = new AuthService();
export default authService;
