import { ApiClient } from './api';
import { AuthService } from './authService';
import { UserService } from './userService';
import { ProductService } from './productService';
import { AdminService } from './adminService';

// Create a shared API client instance
const apiClient = new ApiClient();

// Create service instances
export const authService = new AuthService(apiClient);
export const userService = new UserService(apiClient);
export const productService = new ProductService(apiClient);
export const adminService = new AdminService(apiClient);

// Export service classes for testing or custom instantiation
export { ApiClient, AuthService, UserService, ProductService, AdminService };
