import type { StorageAdapter } from '@/core/adapters/storage/StorageAdapter'
import type { 
  UserGroup, 
  User, 
  GroupAssignment, 
  CreateGroupInput, 
  UpdateGroupInput,
  CreateUserInput,
  UpdateUserInput,
  Permission
} from '@/core/models/UserGroup'
import { 
  UserGroupSchema, 
  UserSchema, 
  CreateGroupInputSchema, 
  CreateUserInputSchema,
  SYSTEM_PERMISSIONS
} from '@/core/models/UserGroup'

/**
 * User Group Service
 * Handles CRUD operations for user groups and user management
 */
export class UserGroupService {
  private readonly storage: StorageAdapter;
  private readonly groupKey = 'user_groups';
  private readonly userKey = 'users';
  private readonly assignmentKey = 'group_assignments';

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  // ===== GROUP MANAGEMENT =====

  /**
   * Get all user groups
   */
  async getAllGroups(): Promise<UserGroup[]> {
    try {
      const groups = await this.storage.list<UserGroup>(this.groupKey);
      return groups.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Failed to get all groups:', error);
      throw new Error('Failed to fetch user groups');
    }
  }

  /**
   * Get group by ID
   */
  async getGroupById(id: string): Promise<UserGroup | null> {
    try {
      if (!id) {
        throw new Error('Group ID is required');
      }
      
      const group = await this.storage.get<UserGroup>(`${this.groupKey}:${id}`);
      return group;
    } catch (error) {
      console.error('Failed to get group by ID:', error);
      throw new Error('Failed to fetch group');
    }
  }

  /**
   * Create a new user group
   */
  async createGroup(input: CreateGroupInput): Promise<UserGroup> {
    try {
      // Validate input
      const validatedInput = CreateGroupInputSchema.parse(input);
      
      // Convert permission IDs to actual permission objects
      const permissions = validatedInput.permissions.map(permissionId => {
        const permission = SYSTEM_PERMISSIONS.find(p => p.id === permissionId);
        if (!permission) {
          throw new Error(`Permission ${permissionId} not found`);
        }
        return permission;
      });

      const group: UserGroup = {
        id: crypto.randomUUID(),
        name: validatedInput.name,
        description: validatedInput.description,
        color: validatedInput.color,
        permissions: permissions,
        userCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user', // TODO: Get from auth context
      };

      await this.storage.set(`${this.groupKey}:${group.id}`, group);
      return group;
    } catch (error) {
      console.error('Failed to create group:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to create group');
    }
  }

  /**
   * Update an existing group
   */
  async updateGroup(id: string, input: UpdateGroupInput): Promise<UserGroup> {
    try {
      if (!id) {
        throw new Error('Group ID is required');
      }

      const existingGroup = await this.getGroupById(id);
      if (!existingGroup) {
        throw new Error('Group not found');
      }

      // Convert permission IDs to actual permission objects if permissions are being updated
      let permissions = existingGroup.permissions;
      if (input.permissions) {
        permissions = input.permissions.map(permissionId => {
          const permission = SYSTEM_PERMISSIONS.find(p => p.id === permissionId);
          if (!permission) {
            throw new Error(`Permission ${permissionId} not found`);
          }
          return permission;
        });
      }

      const updatedGroup: UserGroup = {
        ...existingGroup,
        ...input,
        permissions: permissions,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.groupKey}:${id}`, updatedGroup);
      return updatedGroup;
    } catch (error) {
      console.error('Failed to update group:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to update group');
    }
  }

  /**
   * Delete a group
   */
  async deleteGroup(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('Group ID is required');
      }

      const existingGroup = await this.getGroupById(id);
      if (!existingGroup) {
        throw new Error('Group not found');
      }

      // Remove all user assignments for this group
      await this.removeAllUsersFromGroup(id);

      await this.storage.delete(`${this.groupKey}:${id}`);
    } catch (error) {
      console.error('Failed to delete group:', error);
      throw new Error('Failed to delete group');
    }
  }

  // ===== USER MANAGEMENT =====

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.storage.list<User>(this.userKey);
      return users.sort((a, b) => a.lastName.localeCompare(b.lastName));
    } catch (error) {
      console.error('Failed to get all users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      if (!id) {
        throw new Error('User ID is required');
      }
      
      const user = await this.storage.get<User>(`${this.userKey}:${id}`);
      return user;
    } catch (error) {
      console.error('Failed to get user by ID:', error);
      throw new Error('Failed to fetch user');
    }
  }

  /**
   * Create a new user
   */
  async createUser(input: CreateUserInput): Promise<User> {
    try {
      // Validate input
      const validatedInput = CreateUserInputSchema.parse(input);
      
      const user: User = {
        id: crypto.randomUUID(),
        email: validatedInput.email,
        firstName: validatedInput.firstName,
        lastName: validatedInput.lastName,
        groups: validatedInput.groups || [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.userKey}:${user.id}`, user);
      
      // Update group user counts
      for (const groupId of user.groups) {
        await this.updateGroupUserCount(groupId);
      }

      return user;
    } catch (error) {
      console.error('Failed to create user:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to create user');
    }
  }

  /**
   * Update an existing user
   */
  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    try {
      if (!id) {
        throw new Error('User ID is required');
      }

      const existingUser = await this.getUserById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      const oldGroups = existingUser.groups;
      const updatedUser: User = {
        ...existingUser,
        ...input,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.userKey}:${id}`, updatedUser);

      // Update group user counts for changed groups
      const allGroups = [...new Set([...oldGroups, ...(updatedUser.groups || [])])];
      for (const groupId of allGroups) {
        await this.updateGroupUserCount(groupId);
      }

      return updatedUser;
    } catch (error) {
      console.error('Failed to update user:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to update user');
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('User ID is required');
      }

      const existingUser = await this.getUserById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      // Remove user from all groups
      for (const groupId of existingUser.groups) {
        await this.removeUserFromGroup(id, groupId);
      }

      await this.storage.delete(`${this.userKey}:${id}`);
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error('Failed to delete user');
    }
  }

  // ===== GROUP ASSIGNMENT MANAGEMENT =====

  /**
   * Assign user to group
   */
  async assignUserToGroup(userId: string, groupId: string): Promise<void> {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const group = await this.getGroupById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      if (user.groups.includes(groupId)) {
        return; // User already in group
      }

      // Update user's groups
      const updatedGroups = [...user.groups, groupId];
      await this.updateUser(userId, { groups: updatedGroups });

      // Create assignment record
      const assignment: GroupAssignment = {
        id: crypto.randomUUID(),
        userId,
        groupId,
        assignedAt: new Date().toISOString(),
        assignedBy: 'current-user', // TODO: Get from auth context
      };

      await this.storage.set(`${this.assignmentKey}:${assignment.id}`, assignment);
    } catch (error) {
      console.error('Failed to assign user to group:', error);
      throw new Error('Failed to assign user to group');
    }
  }

  /**
   * Remove user from group
   */
  async removeUserFromGroup(userId: string, groupId: string): Promise<void> {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.groups.includes(groupId)) {
        return; // User not in group
      }

      // Update user's groups
      const updatedGroups = user.groups.filter(id => id !== groupId);
      await this.updateUser(userId, { groups: updatedGroups });
    } catch (error) {
      console.error('Failed to remove user from group:', error);
      throw new Error('Failed to remove user from group');
    }
  }

  /**
   * Remove all users from a group
   */
  async removeAllUsersFromGroup(groupId: string): Promise<void> {
    try {
      const users = await this.getAllUsers();
      const usersInGroup = users.filter(user => user.groups.includes(groupId));

      for (const user of usersInGroup) {
        await this.removeUserFromGroup(user.id, groupId);
      }
    } catch (error) {
      console.error('Failed to remove all users from group:', error);
      throw new Error('Failed to remove all users from group');
    }
  }

  /**
   * Get users in a specific group
   */
  async getUsersInGroup(groupId: string): Promise<User[]> {
    try {
      const users = await this.getAllUsers();
      return users.filter(user => user.groups.includes(groupId));
    } catch (error) {
      console.error('Failed to get users in group:', error);
      throw new Error('Failed to get users in group');
    }
  }

  /**
   * Get groups for a specific user
   */
  async getGroupsForUser(userId: string): Promise<UserGroup[]> {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const groups: UserGroup[] = [];
      for (const groupId of user.groups) {
        const group = await this.getGroupById(groupId);
        if (group) {
          groups.push(group);
        }
      }

      return groups;
    } catch (error) {
      console.error('Failed to get groups for user:', error);
      throw new Error('Failed to get groups for user');
    }
  }

  // ===== HELPER METHODS =====

  /**
   * Update user count for a group
   */
  private async updateGroupUserCount(groupId: string): Promise<void> {
    try {
      const users = await this.getAllUsers();
      const userCount = users.filter(user => user.groups.includes(groupId)).length;

      const group = await this.getGroupById(groupId);
      if (group) {
        await this.updateGroup(groupId, { userCount });
      }
    } catch (error) {
      console.error('Failed to update group user count:', error);
    }
  }

  /**
   * Get group statistics
   */
  async getGroupStats(): Promise<{
    totalGroups: number;
    totalUsers: number;
    averageUsersPerGroup: number;
    mostUsedGroup?: UserGroup;
  }> {
    try {
      const groups = await this.getAllGroups();
      const users = await this.getAllUsers();

      const totalGroups = groups.length;
      const totalUsers = users.length;
      const averageUsersPerGroup = totalGroups > 0 ? totalUsers / totalGroups : 0;
      const mostUsedGroup = groups.reduce((max, group) => 
        group.userCount > (max?.userCount || 0) ? group : max, groups[0]);

      return {
        totalGroups,
        totalUsers,
        averageUsersPerGroup,
        mostUsedGroup,
      };
    } catch (error) {
      console.error('Failed to get group stats:', error);
      throw new Error('Failed to get group statistics');
    }
  }
}
