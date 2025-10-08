import { z } from 'zod'

/**
 * User Group Model
 * Represents a group that users can be assigned to for role-based access control
 */
export interface UserGroup {
  id: string
  name: string
  description: string
  color: string
  permissions: Permission[]
  userCount: number
  createdAt: string
  updatedAt: string
  createdBy: string
}

/**
 * Permission Model
 * Defines what actions a group can perform
 */
export interface Permission {
  id: string
  name: string
  description: string
  resource: string // e.g., 'clients', 'suppliers', 'finance'
  action: string   // e.g., 'read', 'write', 'delete', 'admin'
}

/**
 * User Model (Extended)
 * Represents a user with group assignments
 */
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  groups: string[] // Array of group IDs
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

/**
 * Group Assignment Model
 * Represents the relationship between users and groups
 */
export interface GroupAssignment {
  id: string
  userId: string
  groupId: string
  assignedAt: string
  assignedBy: string
}

/**
 * Input types for creating and updating groups
 */
export interface CreateGroupInput {
  name: string
  description: string
  color: string
  permissions: string[] // Array of permission IDs
}

export interface UpdateGroupInput {
  name?: string
  description?: string
  color?: string
  permissions?: string[]
}

export interface CreateUserInput {
  email: string
  firstName: string
  lastName: string
  groups?: string[]
}

export interface UpdateUserInput {
  firstName?: string
  lastName?: string
  groups?: string[]
  isActive?: boolean
}

/**
 * Zod schemas for validation
 */
export const PermissionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Permission name is required'),
  description: z.string().min(1, 'Permission description is required'),
  resource: z.string().min(1, 'Resource is required'),
  action: z.string().min(1, 'Action is required'),
})

export const UserGroupSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Group name is required').max(50, 'Group name must be less than 50 characters'),
  description: z.string().min(1, 'Description is required').max(200, 'Description must be less than 200 characters'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color'),
  permissions: z.array(PermissionSchema),
  userCount: z.number().min(0),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
})

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  avatar: z.string().optional(),
  groups: z.array(z.string()),
  isActive: z.boolean(),
  lastLogin: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateGroupInputSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(50, 'Group name must be less than 50 characters'),
  description: z.string().min(1, 'Description is required').max(200, 'Description must be less than 200 characters'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color'),
  permissions: z.array(z.string()),
})

export const CreateUserInputSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  groups: z.array(z.string()).optional(),
})

/**
 * Predefined permissions for the system
 */
export const SYSTEM_PERMISSIONS: Permission[] = [
  // Client Management
  { id: 'clients:read', name: 'View Clients', description: 'View client information', resource: 'clients', action: 'read' },
  { id: 'clients:write', name: 'Manage Clients', description: 'Create and edit clients', resource: 'clients', action: 'write' },
  { id: 'clients:delete', name: 'Delete Clients', description: 'Delete client records', resource: 'clients', action: 'delete' },
  
  // Supplier Management
  { id: 'suppliers:read', name: 'View Suppliers', description: 'View supplier information', resource: 'suppliers', action: 'read' },
  { id: 'suppliers:write', name: 'Manage Suppliers', description: 'Create and edit suppliers', resource: 'suppliers', action: 'write' },
  { id: 'suppliers:delete', name: 'Delete Suppliers', description: 'Delete supplier records', resource: 'suppliers', action: 'delete' },
  
  // Finance Management
  { id: 'finance:read', name: 'View Finance', description: 'View financial reports', resource: 'finance', action: 'read' },
  { id: 'finance:write', name: 'Manage Finance', description: 'Create invoices and bills', resource: 'finance', action: 'write' },
  { id: 'finance:admin', name: 'Finance Admin', description: 'Full financial management access', resource: 'finance', action: 'admin' },
  
  // User Management
  { id: 'users:read', name: 'View Users', description: 'View user information', resource: 'users', action: 'read' },
  { id: 'users:write', name: 'Manage Users', description: 'Create and edit users', resource: 'users', action: 'write' },
  { id: 'users:admin', name: 'User Admin', description: 'Full user management access', resource: 'users', action: 'admin' },
  
  // Settings
  { id: 'settings:read', name: 'View Settings', description: 'View application settings', resource: 'settings', action: 'read' },
  { id: 'settings:write', name: 'Manage Settings', description: 'Modify application settings', resource: 'settings', action: 'write' },
]

/**
 * Predefined group colors
 */
export const GROUP_COLORS = [
  '#2563eb', // Blue
  '#dc2626', // Red
  '#059669', // Green
  '#d97706', // Orange
  '#7c3aed', // Purple
  '#0891b2', // Cyan
  '#be185d', // Pink
  '#65a30d', // Lime
  '#ea580c', // Orange
  '#4338ca', // Indigo
]
