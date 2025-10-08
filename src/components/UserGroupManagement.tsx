import React, { useState } from 'react'
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Plus, 
  Settings, 
  BarChart3, 
  Shield,
  UserCheck,
  UserX,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { 
  useUserGroups, 
  useUsers, 
  useCreateGroup, 
  useUpdateGroup, 
  useDeleteGroup,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useAssignUserToGroup,
  useRemoveUserFromGroup,
  useGroupStats
} from '@/hooks/useUserGroup'
import { SYSTEM_PERMISSIONS, GROUP_COLORS } from '@/core/models/UserGroup'
import { seedUserGroups } from '@/utils/seedUserGroups'
import { useStorage } from '@/hooks/useStorage'
import type { 
  UserGroup, 
  User, 
  CreateGroupInput, 
  UpdateGroupInput,
  CreateUserInput,
  UpdateUserInput,
  Permission
} from '@/core/models/UserGroup'

export function UserGroupManagement() {
  const [activeTab, setActiveTab] = useState<'groups' | 'users' | 'stats'>('groups')
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSeeding, setIsSeeding] = useState(false)

  // Data fetching
  const { data: groups = [], isLoading: groupsLoading, refetch: refetchGroups } = useUserGroups()
  const { data: users = [], isLoading: usersLoading, refetch: refetchUsers } = useUsers()
  const { data: stats } = useGroupStats()

  // Storage hook for seeding
  const storage = useStorage()

  // Mutations
  const createGroupMutation = useCreateGroup()
  const updateGroupMutation = useUpdateGroup()
  const deleteGroupMutation = useDeleteGroup()
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()
  const assignUserMutation = useAssignUserToGroup()
  const removeUserMutation = useRemoveUserFromGroup()

  // Filter data based on search
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateGroup = () => {
    setEditingGroup(null)
    setShowGroupModal(true)
  }

  const handleEditGroup = (group: UserGroup) => {
    setEditingGroup(group)
    setShowGroupModal(true)
  }

  const handleCreateUser = () => {
    setEditingUser(null)
    setShowUserModal(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setShowUserModal(true)
  }

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group? This will remove all users from the group.')) {
      try {
        await deleteGroupMutation.mutateAsync(groupId)
      } catch (error) {
        console.error('Failed to delete group:', error)
      }
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserMutation.mutateAsync(userId)
      } catch (error) {
        console.error('Failed to delete user:', error)
      }
    }
  }

  const handleAssignUserToGroup = async (userId: string, groupId: string) => {
    try {
      await assignUserMutation.mutateAsync({ userId, groupId })
    } catch (error) {
      console.error('Failed to assign user to group:', error)
    }
  }

  const handleRemoveUserFromGroup = async (userId: string, groupId: string) => {
    try {
      await removeUserMutation.mutateAsync({ userId, groupId })
    } catch (error) {
      console.error('Failed to remove user from group:', error)
    }
  }

  const handleSeedData = async () => {
    if (window.confirm('This will create sample groups and users. Continue?')) {
      setIsSeeding(true)
      try {
        await seedUserGroups(storage)
        // Refetch data to show the new groups and users
        await refetchGroups()
        await refetchUsers()
        alert('Sample data created successfully!')
      } catch (error) {
        console.error('Failed to seed data:', error)
        alert('Failed to create sample data')
      } finally {
        setIsSeeding(false)
      }
    }
  }

  return (
    <div className="card user-group-management">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">
            <Users className="h-5 w-5 me-2" />
            User & Group Management
          </h5>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-success btn-sm"
              onClick={handleSeedData}
              disabled={isSeeding}
            >
              {isSeeding ? (
                <>
                  <div className="spinner-border spinner-border-sm me-1" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Seeding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 me-1" />
                  Seed Sample Data
                </>
              )}
            </button>
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => setActiveTab('stats')}
            >
              <BarChart3 className="h-4 w-4 me-1" />
              Statistics
            </button>
          </div>
        </div>
      </div>

      <div className="card-body">
        {/* Tab Navigation */}
        <ul className="nav nav-tabs mb-4" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'groups' ? 'active' : ''}`}
              onClick={() => setActiveTab('groups')}
            >
              <Shield className="h-4 w-4 me-1" />
              Groups ({groups.length})
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users className="h-4 w-4 me-1" />
              Users ({users.length})
            </button>
          </li>
        </ul>

        {/* Search Bar */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6 text-end">
            {activeTab === 'groups' && (
              <button 
                className="btn btn-primary"
                onClick={handleCreateGroup}
                disabled={createGroupMutation.isPending}
              >
                <Plus className="h-4 w-4 me-1" />
                Create Group
              </button>
            )}
            {activeTab === 'users' && (
              <button 
                className="btn btn-primary"
                onClick={handleCreateUser}
                disabled={createUserMutation.isPending}
              >
                <UserPlus className="h-4 w-4 me-1" />
                Add User
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'groups' && (
          <GroupsTab 
            groups={filteredGroups}
            users={users}
            loading={groupsLoading}
            onEdit={handleEditGroup}
            onDelete={handleDeleteGroup}
            onAssignUser={handleAssignUserToGroup}
            onRemoveUser={handleRemoveUserFromGroup}
          />
        )}

        {activeTab === 'users' && (
          <UsersTab 
            users={filteredUsers}
            groups={groups}
            loading={usersLoading}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onAssignUser={handleAssignUserToGroup}
            onRemoveUser={handleRemoveUserFromGroup}
          />
        )}

        {activeTab === 'stats' && (
          <StatsTab stats={stats} />
        )}
      </div>

      {/* Modals */}
      {showGroupModal && (
        <GroupModal
          group={editingGroup}
          onClose={() => setShowGroupModal(false)}
          onCreate={createGroupMutation.mutateAsync}
          onUpdate={updateGroupMutation.mutateAsync}
        />
      )}

      {showUserModal && (
        <UserModal
          user={editingUser}
          groups={groups}
          onClose={() => setShowUserModal(false)}
          onCreate={createUserMutation.mutateAsync}
          onUpdate={updateUserMutation.mutateAsync}
        />
      )}
    </div>
  )
}

// Groups Tab Component
function GroupsTab({ 
  groups, 
  users, 
  loading, 
  onEdit, 
  onDelete, 
  onAssignUser, 
  onRemoveUser 
}: {
  groups: UserGroup[]
  users: User[]
  loading: boolean
  onEdit: (group: UserGroup) => void
  onDelete: (groupId: string) => void
  onAssignUser: (userId: string, groupId: string) => void
  onRemoveUser: (userId: string, groupId: string) => void
}) {
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-5">
        <Shield className="h-12 w-12 text-muted mb-3" />
        <h6 className="text-muted">No groups found</h6>
        <p className="text-muted">Create your first group to get started with user management.</p>
      </div>
    )
  }

  return (
    <div className="row">
      {groups.map((group) => (
        <div key={group.id} className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div 
                  className="rounded-circle me-2" 
                  style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: group.color 
                  }}
                />
                <h6 className="mb-0">{group.name}</h6>
              </div>
              <div className="dropdown">
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  data-bs-toggle="dropdown"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button 
                      className="dropdown-item"
                      onClick={() => onEdit(group)}
                    >
                      <Edit className="h-4 w-4 me-2" />
                      Edit
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item text-danger"
                      onClick={() => onDelete(group.id)}
                    >
                      <Trash2 className="h-4 w-4 me-2" />
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="card-body">
              <p className="text-muted small mb-3">{group.description}</p>
              
              <div className="mb-3">
                <small className="text-muted">Permissions ({group.permissions.length})</small>
                <div className="mt-1">
                  {group.permissions.slice(0, 3).map((permission) => (
                    <span 
                      key={permission.id}
                      className="badge bg-light text-dark me-1 mb-1"
                    >
                      {permission.name}
                    </span>
                  ))}
                  {group.permissions.length > 3 && (
                    <span className="badge bg-secondary">
                      +{group.permissions.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">Members ({group.userCount})</small>
                <div className="mt-1">
                  {users
                    .filter(user => user.groups.includes(group.id))
                    .slice(0, 3)
                    .map((user) => (
                      <div key={user.id} className="d-flex align-items-center justify-content-between mb-1">
                        <span className="small">
                          {user.firstName} {user.lastName}
                        </span>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onRemoveUser(user.id, group.id)}
                        >
                          <UserX className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  {group.userCount > 3 && (
                    <small className="text-muted">+{group.userCount - 3} more members</small>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Users Tab Component
function UsersTab({ 
  users, 
  groups, 
  loading, 
  onEdit, 
  onDelete, 
  onAssignUser, 
  onRemoveUser 
}: {
  users: User[]
  groups: UserGroup[]
  loading: boolean
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
  onAssignUser: (userId: string, groupId: string) => void
  onRemoveUser: (userId: string, groupId: string) => void
}) {
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-5">
        <Users className="h-12 w-12 text-muted mb-3" />
        <h6 className="text-muted">No users found</h6>
        <p className="text-muted">Add your first user to get started.</p>
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Groups</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="d-flex align-items-center">
                  <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <div className="fw-medium">{user.firstName} {user.lastName}</div>
                  </div>
                </div>
              </td>
              <td>{user.email}</td>
              <td>
                <div className="d-flex flex-wrap gap-1">
                  {user.groups.map((groupId) => {
                    const group = groups.find(g => g.id === groupId)
                    return group ? (
                      <span 
                        key={groupId}
                        className="badge"
                        style={{ backgroundColor: group.color }}
                      >
                        {group.name}
                      </span>
                    ) : null
                  })}
                </div>
              </td>
              <td>
                <span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
              </td>
              <td>
                <div className="d-flex gap-1">
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onEdit(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Statistics Tab Component
function StatsTab({ stats }: { stats: any }) {
  if (!stats) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="row">
      <div className="col-md-3 mb-4">
        <div className="card bg-primary text-white">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <Shield className="h-8 w-8 me-3" />
              <div>
                <h4 className="mb-0">{stats.totalGroups}</h4>
                <small>Total Groups</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-4">
        <div className="card bg-success text-white">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <Users className="h-8 w-8 me-3" />
              <div>
                <h4 className="mb-0">{stats.totalUsers}</h4>
                <small>Total Users</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-4">
        <div className="card bg-info text-white">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <BarChart3 className="h-8 w-8 me-3" />
              <div>
                <h4 className="mb-0">{stats.averageUsersPerGroup.toFixed(1)}</h4>
                <small>Avg Users/Group</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-4">
        <div className="card bg-warning text-white">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <UserCheck className="h-8 w-8 me-3" />
              <div>
                <h4 className="mb-0">{stats.mostUsedGroup?.name || 'N/A'}</h4>
                <small>Most Used Group</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Group Modal Component
function GroupModal({ 
  group, 
  onClose, 
  onCreate, 
  onUpdate 
}: {
  group: UserGroup | null
  onClose: () => void
  onCreate: (input: CreateGroupInput) => Promise<UserGroup>
  onUpdate: (params: { id: string; input: UpdateGroupInput }) => Promise<UserGroup>
}) {
  const [formData, setFormData] = useState({
    name: group?.name || '',
    description: group?.description || '',
    color: group?.color || GROUP_COLORS[0],
    permissions: group?.permissions.map(p => p.id) || []
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (group) {
        await onUpdate({ id: group.id, input: formData })
      } else {
        await onCreate(formData)
      }
      onClose()
    } catch (error) {
      console.error('Failed to save group:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {group ? 'Edit Group' : 'Create New Group'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Group Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Color</label>
                    <div className="d-flex gap-2">
                      {GROUP_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`btn btn-sm ${formData.color === color ? 'btn-primary' : 'btn-outline-secondary'}`}
                          style={{ backgroundColor: color, borderColor: color }}
                          onClick={() => setFormData(prev => ({ ...prev, color }))}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Permissions</label>
                <div className="row">
                  {Object.entries(
                    SYSTEM_PERMISSIONS.reduce((acc, permission) => {
                      if (!acc[permission.resource]) {
                        acc[permission.resource] = []
                      }
                      acc[permission.resource].push(permission)
                      return acc
                    }, {} as Record<string, Permission[]>)
                  ).map(([resource, permissions]) => (
                    <div key={resource} className="col-md-6 mb-3">
                      <h6 className="text-capitalize">{resource}</h6>
                      {permissions.map((permission) => (
                        <div key={permission.id} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={permission.id}
                            checked={formData.permissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                          />
                          <label className="form-check-label" htmlFor={permission.id}>
                            {permission.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (group ? 'Update Group' : 'Create Group')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// User Modal Component
function UserModal({ 
  user, 
  groups, 
  onClose, 
  onCreate, 
  onUpdate 
}: {
  user: User | null
  groups: UserGroup[]
  onClose: () => void
  onCreate: (input: CreateUserInput) => Promise<User>
  onUpdate: (params: { id: string; input: UpdateUserInput }) => Promise<User>
}) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    groups: user?.groups || [],
    isActive: user?.isActive ?? true
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (user) {
        await onUpdate({ id: user.id, input: formData })
      } else {
        await onCreate(formData)
      }
      onClose()
    } catch (error) {
      console.error('Failed to save user:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleGroup = (groupId: string) => {
    setFormData(prev => ({
      ...prev,
      groups: prev.groups.includes(groupId)
        ? prev.groups.filter(id => id !== groupId)
        : [...prev.groups, groupId]
    }))
  }

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {user ? 'Edit User' : 'Add New User'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  disabled={!!user} // Don't allow editing email for existing users
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Groups</label>
                <div className="row">
                  {groups.map((group) => (
                    <div key={group.id} className="col-md-6 mb-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={group.id}
                          checked={formData.groups.includes(group.id)}
                          onChange={() => toggleGroup(group.id)}
                        />
                        <label className="form-check-label d-flex align-items-center" htmlFor={group.id}>
                          <div 
                            className="rounded-circle me-2" 
                            style={{ 
                              width: '8px', 
                              height: '8px', 
                              backgroundColor: group.color 
                            }}
                          />
                          {group.name}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  <label className="form-check-label" htmlFor="isActive">
                    Active User
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (user ? 'Update User' : 'Create User')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
