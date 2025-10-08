import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useStorage } from '@/hooks/useStorage'
import { UserGroupService } from '@/core/services/userGroupService'
import type { 
  UserGroup, 
  User, 
  CreateGroupInput, 
  UpdateGroupInput,
  CreateUserInput,
  UpdateUserInput
} from '@/core/models/UserGroup'

/**
 * Query keys for user group operations
 */
export const userGroupKeys = {
  all: ['userGroups'] as const,
  groups: () => [...userGroupKeys.all, 'groups'] as const,
  group: (id: string) => [...userGroupKeys.groups(), id] as const,
  users: () => [...userGroupKeys.all, 'users'] as const,
  user: (id: string) => [...userGroupKeys.users(), id] as const,
  stats: () => [...userGroupKeys.all, 'stats'] as const,
  usersInGroup: (groupId: string) => [...userGroupKeys.groups(), groupId, 'users'] as const,
  groupsForUser: (userId: string) => [...userGroupKeys.users(), userId, 'groups'] as const,
};

/**
 * Hook to get user group service instance
 */
function useUserGroupService() {
  const storage = useStorage();
  return new UserGroupService(storage);
}

// ===== GROUP HOOKS =====

/**
 * Hook to get all user groups
 */
export function useUserGroups() {
  const userGroupService = useUserGroupService();

  return useQuery({
    queryKey: userGroupKeys.groups(),
    queryFn: () => userGroupService.getAllGroups(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get a single group by ID
 */
export function useUserGroup(id: string) {
  const userGroupService = useUserGroupService()

  return useQuery({
    queryKey: userGroupKeys.group(id),
    queryFn: () => userGroupService.getGroupById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to create a new group
 */
export function useCreateGroup() {
  const queryClient = useQueryClient();
  const userGroupService = useUserGroupService();

  return useMutation({
    mutationFn: (input: CreateGroupInput) => userGroupService.createGroup(input),
    onSuccess: (newGroup) => {
      // Invalidate and refetch group lists
      queryClient.invalidateQueries({ queryKey: userGroupKeys.groups() })
      queryClient.invalidateQueries({ queryKey: userGroupKeys.stats() })
      
      // Add the new group to the cache
      queryClient.setQueryData(userGroupKeys.group(newGroup.id), newGroup)
    },
    onError: (error) => {
      console.error('Failed to create group:', error);
    },
  });
}

/**
 * Hook to update a group
 */
export function useUpdateGroup() {
  const queryClient = useQueryClient();
  const userGroupService = useUserGroupService();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateGroupInput }) =>
      userGroupService.updateGroup(id, input),
    onSuccess: (updatedGroup) => {
      // Update the group in the cache
      queryClient.setQueryData(userGroupKeys.group(updatedGroup.id), updatedGroup)
      
      // Invalidate group lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: userGroupKeys.groups() })
      queryClient.invalidateQueries({ queryKey: userGroupKeys.stats() })
    },
    onError: (error) => {
      console.error('Failed to update group:', error);
    },
  });
}

/**
 * Hook to delete a group
 */
export function useDeleteGroup() {
  const queryClient = useQueryClient();
  const userGroupService = useUserGroupService();

  return useMutation({
    mutationFn: (id: string) => userGroupService.deleteGroup(id),
    onSuccess: (_, deletedId) => {
      // Remove the group from the cache
      queryClient.removeQueries({ queryKey: userGroupKeys.group(deletedId) });
      
      // Invalidate group lists and stats
      queryClient.invalidateQueries({ queryKey: userGroupKeys.groups() });
      queryClient.invalidateQueries({ queryKey: userGroupKeys.stats() });
      queryClient.invalidateQueries({ queryKey: userGroupKeys.users() });
    },
    onError: (error) => {
      console.error('Failed to delete group:', error);
    },
  });
}

// ===== USER HOOKS =====

/**
 * Hook to get all users
 */
export function useUsers() {
  const userGroupService = useUserGroupService();

  return useQuery({
    queryKey: userGroupKeys.users(),
    queryFn: () => userGroupService.getAllUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get a single user by ID
 */
export function useUser(id: string) {
  const userGroupService = useUserGroupService()

  return useQuery({
    queryKey: userGroupKeys.user(id),
    queryFn: () => userGroupService.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  const userGroupService = useUserGroupService();

  return useMutation({
    mutationFn: (input: CreateUserInput) => userGroupService.createUser(input),
    onSuccess: (newUser) => {
      // Invalidate and refetch user lists
      queryClient.invalidateQueries({ queryKey: userGroupKeys.users() })
      queryClient.invalidateQueries({ queryKey: userGroupKeys.stats() })
      
      // Add the new user to the cache
      queryClient.setQueryData(userGroupKeys.user(newUser.id), newUser)
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    },
  });
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const userGroupService = useUserGroupService();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
      userGroupService.updateUser(id, input),
    onSuccess: (updatedUser) => {
      // Update the user in the cache
      queryClient.setQueryData(userGroupKeys.user(updatedUser.id), updatedUser)
      
      // Invalidate user lists and stats to ensure consistency
      queryClient.invalidateQueries({ queryKey: userGroupKeys.users() })
      queryClient.invalidateQueries({ queryKey: userGroupKeys.stats() })
      queryClient.invalidateQueries({ queryKey: userGroupKeys.groups() })
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const userGroupService = useUserGroupService();

  return useMutation({
    mutationFn: (id: string) => userGroupService.deleteUser(id),
    onSuccess: (_, deletedId) => {
      // Remove the user from the cache
      queryClient.removeQueries({ queryKey: userGroupKeys.user(deletedId) });
      
      // Invalidate user lists and stats
      queryClient.invalidateQueries({ queryKey: userGroupKeys.users() });
      queryClient.invalidateQueries({ queryKey: userGroupKeys.stats() });
      queryClient.invalidateQueries({ queryKey: userGroupKeys.groups() });
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
    },
  });
}

// ===== GROUP ASSIGNMENT HOOKS =====

/**
 * Hook to assign user to group
 */
export function useAssignUserToGroup() {
  const queryClient = useQueryClient();
  const userGroupService = useUserGroupService();

  return useMutation({
    mutationFn: ({ userId, groupId }: { userId: string; groupId: string }) =>
      userGroupService.assignUserToGroup(userId, groupId),
    onSuccess: (_, { userId, groupId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: userGroupKeys.user(userId) });
      queryClient.invalidateQueries({ queryKey: userGroupKeys.group(groupId) });
      queryClient.invalidateQueries({ queryKey: userGroupKeys.usersInGroup(groupId) });
      queryClient.invalidateQueries({ queryKey: userGroupKeys.groupsForUser(userId) });
      queryClient.invalidateQueries({ queryKey: userGroupKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to assign user to group:', error);
    },
  });
}

/**
 * Hook to remove user from group
 */
export function useRemoveUserFromGroup() {
  const queryClient = useQueryClient();
  const userGroupService = useUserGroupService();

  return useMutation({
    mutationFn: ({ userId, groupId }: { userId: string; groupId: string }) =>
      userGroupService.removeUserFromGroup(userId, groupId),
    onSuccess: (_, { userId, groupId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: userGroupKeys.user(userId) });
      queryClient.invalidateQueries({ queryKey: userGroupKeys.group(groupId) });
      queryClient.invalidateQueries({ queryKey: userGroupKeys.usersInGroup(groupId) });
      queryClient.invalidateQueries({ queryKey: userGroupKeys.groupsForUser(userId) });
      queryClient.invalidateQueries({ queryKey: userGroupKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to remove user from group:', error);
    },
  });
}

/**
 * Hook to get users in a specific group
 */
export function useUsersInGroup(groupId: string) {
  const userGroupService = useUserGroupService()

  return useQuery({
    queryKey: userGroupKeys.usersInGroup(groupId),
    queryFn: () => userGroupService.getUsersInGroup(groupId),
    enabled: !!groupId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get groups for a specific user
 */
export function useGroupsForUser(userId: string) {
  const userGroupService = useUserGroupService()

  return useQuery({
    queryKey: userGroupKeys.groupsForUser(userId),
    queryFn: () => userGroupService.getGroupsForUser(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get group statistics
 */
export function useGroupStats() {
  const userGroupService = useUserGroupService();

  return useQuery({
    queryKey: userGroupKeys.stats(),
    queryFn: () => userGroupService.getGroupStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to prefetch a group
 */
export function usePrefetchGroup() {
  const queryClient = useQueryClient()
  const userGroupService = useUserGroupService()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: userGroupKeys.group(id),
      queryFn: () => userGroupService.getGroupById(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }
}

/**
 * Hook to prefetch a user
 */
export function usePrefetchUser() {
  const queryClient = useQueryClient()
  const userGroupService = useUserGroupService()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: userGroupKeys.user(id),
      queryFn: () => userGroupService.getUserById(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }
}
