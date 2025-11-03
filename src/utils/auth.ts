export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'operator' | 'user';
}

export interface UserCredentials {
  email: string;
  password: string;
  name?: string;
}

// Default demo credentials
const DEMO_CREDENTIALS = {
  admin: {
    email: 'admin@oilguard.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
  },
  operator: {
    email: 'operator@oilguard.com',
    password: 'operator123',
    name: 'Operator User',
    role: 'operator' as const,
  },
};

// Store users in localStorage
const STORAGE_KEY = 'ais_oilguard_users';
const AUTH_KEY = 'ais_oilguard_auth';

// Initialize with demo accounts if no users exist
const initializeUsers = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const defaultUsers = [
      {
        id: 'admin-001',
        email: DEMO_CREDENTIALS.admin.email,
        password: DEMO_CREDENTIALS.admin.password, // In production, this would be hashed
        name: DEMO_CREDENTIALS.admin.name,
        role: DEMO_CREDENTIALS.admin.role,
      },
      {
        id: 'operator-001',
        email: DEMO_CREDENTIALS.operator.email,
        password: DEMO_CREDENTIALS.operator.password,
        name: DEMO_CREDENTIALS.operator.name,
        role: DEMO_CREDENTIALS.operator.role,
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  }
};

initializeUsers();

export const authService = {
  // Register a new user
  register: (credentials: UserCredentials): { success: boolean; message: string; user?: User } => {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      
      // Check if user already exists
      if (users.some((u: any) => u.email === credentials.email)) {
        return { success: false, message: 'User with this email already exists' };
      }

      if (!credentials.name) {
        return { success: false, message: 'Name is required' };
      }

      const newUser = {
        id: `user-${Date.now()}`,
        email: credentials.email,
        password: credentials.password, // In production, hash this
        name: credentials.name,
        role: 'user' as const,
      };

      users.push(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

      const { password, ...userWithoutPassword } = newUser;
      return {
        success: true,
        message: 'Registration successful',
        user: userWithoutPassword as User,
      };
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  },

  // Login
  login: (credentials: UserCredentials): { success: boolean; message: string; user?: User } => {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      
      const user = users.find(
        (u: any) => u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        return { success: false, message: 'Invalid email or password' };
      }

      const { password, ...userWithoutPassword } = user;
      
      // Store auth session
      localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));

      return {
        success: true,
        message: 'Login successful',
        user: userWithoutPassword as User,
      };
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem(AUTH_KEY);
  },

  // Get current user
  getCurrentUser: (): User | null => {
    try {
      const auth = localStorage.getItem(AUTH_KEY);
      if (!auth) return null;
      return JSON.parse(auth);
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_KEY);
  },

  // Get demo credentials (for display in UI)
  getDemoCredentials: () => DEMO_CREDENTIALS,
};


