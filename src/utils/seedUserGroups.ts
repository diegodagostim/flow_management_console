import { UserGroupService } from '@/core/services/userGroupService'
import { SYSTEM_PERMISSIONS, GROUP_COLORS } from '@/core/models/UserGroup'
import type { CreateGroupInput, CreateUserInput } from '@/core/models/UserGroup'

/**
 * Seed initial user groups and users for demonstration
 */
export async function seedUserGroups(storage: any) {
  const userGroupService = new UserGroupService(storage)

  try {
    // Check if data already exists
    const existingGroups = await userGroupService.getAllGroups()
    if (existingGroups.length > 0) {
      console.log('User groups already exist, skipping seed')
      return
    }

    console.log('Seeding user groups and users...')

    // Create sample groups
    const groups: CreateGroupInput[] = [
      {
        name: 'Administrators',
        description: 'Full system access with all permissions',
        color: GROUP_COLORS[0], // Blue
        permissions: SYSTEM_PERMISSIONS.map(p => p.id) // All permissions
      },
      {
        name: 'Managers',
        description: 'Management access to clients, suppliers, and finance',
        color: GROUP_COLORS[1], // Red
        permissions: [
          'clients:read', 'clients:write', 'clients:delete',
          'suppliers:read', 'suppliers:write', 'suppliers:delete',
          'finance:read', 'finance:write',
          'users:read', 'users:write',
          'settings:read'
        ]
      },
      {
        name: 'Finance Team',
        description: 'Access to financial data and reports',
        color: GROUP_COLORS[2], // Green
        permissions: [
          'finance:read', 'finance:write', 'finance:admin',
          'clients:read',
          'suppliers:read',
          'settings:read'
        ]
      },
      {
        name: 'Sales Team',
        description: 'Client management and sales operations',
        color: GROUP_COLORS[3], // Orange
        permissions: [
          'clients:read', 'clients:write',
          'finance:read',
          'suppliers:read'
        ]
      },
      {
        name: 'View Only',
        description: 'Read-only access to most data',
        color: GROUP_COLORS[4], // Purple
        permissions: [
          'clients:read',
          'suppliers:read',
          'finance:read',
          'users:read',
          'settings:read'
        ]
      }
    ]

    // Create groups
    const createdGroups = []
    for (const groupData of groups) {
      const group = await userGroupService.createGroup(groupData)
      createdGroups.push(group)
      console.log(`Created group: ${group.name}`)
    }

    // Create sample users
    const users: CreateUserInput[] = [
      {
        firstName: 'John',
        lastName: 'Admin',
        email: 'john.admin@company.com',
        groups: [createdGroups[0].id] // Administrators
      },
      {
        firstName: 'Sarah',
        lastName: 'Manager',
        email: 'sarah.manager@company.com',
        groups: [createdGroups[1].id] // Managers
      },
      {
        firstName: 'Mike',
        lastName: 'Finance',
        email: 'mike.finance@company.com',
        groups: [createdGroups[2].id] // Finance Team
      },
      {
        firstName: 'Lisa',
        lastName: 'Sales',
        email: 'lisa.sales@company.com',
        groups: [createdGroups[3].id] // Sales Team
      },
      {
        firstName: 'Tom',
        lastName: 'Viewer',
        email: 'tom.viewer@company.com',
        groups: [createdGroups[4].id] // View Only
      },
      {
        firstName: 'Emma',
        lastName: 'Multi',
        email: 'emma.multi@company.com',
        groups: [createdGroups[1].id, createdGroups[2].id] // Manager + Finance
      }
    ]

    // Create users
    for (const userData of users) {
      const user = await userGroupService.createUser(userData)
      console.log(`Created user: ${user.firstName} ${user.lastName}`)
    }

    console.log('User groups and users seeded successfully!')
  } catch (error) {
    console.error('Failed to seed user groups:', error)
    throw error
  }
}
