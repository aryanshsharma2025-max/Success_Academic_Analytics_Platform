import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PROTOTYPE_USERS, dataService } from '../data/dataService';

export const SCR012_UserManagement = () => {
  const { currentUser } = useAuth();
  const isReadOnly = currentUser?.roleName === 'Auditor / Viewer';

  const [users, setUsers] = useState(PROTOTYPE_USERS);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isActiveStatus, setIsActiveStatus] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Faculty');
  const [successNotice, setSuccessNotice] = useState('');

  const handleEditRoles = (user) => {
    setEditingUser(user);
    setSelectedRoles([user.roleName]);
    setIsActiveStatus(user.isActive);
  };

  const handleToggleRole = (role) => {
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length === 1) {
        alert('A user must have at least one active RBAC role assigned.');
        return;
      }
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSaveRoleAssignments = () => {
    setUsers(prev => prev.map(u => {
      if (u.userId === editingUser.userId) {
        return {
          ...u,
          roleName: selectedRoles[0], // primary role
          isActive: isActiveStatus
        };
      }
      return u;
    }));

    dataService.addAuditLog({
      actorUserId: currentUser?.username || 'sys_admin',
      action: 'USER_ROLE_ASSIGN',
      entityAffected: 'UserRoles',
      entityId: editingUser.username,
      result: 'SUCCESS'
    });

    setSuccessNotice(`Role assignments for ${editingUser.username} saved and audited successfully.`);
    setEditingUser(null);
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleToggleLock = (user) => {
    setUsers(prev => prev.map(u => {
      if (u.userId === user.userId) {
        const nextStatus = !u.isActive;
        dataService.addAuditLog({
          actorUserId: currentUser?.username || 'sys_admin',
          action: nextStatus ? 'USER_REACTIVATE' : 'USER_SUSPEND',
          entityAffected: 'Users',
          entityId: u.username,
          result: 'SUCCESS'
        });
        return { ...u, isActive: nextStatus };
      }
      return u;
    }));
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newEmail.trim()) {
      alert('Username and Email are mandatory.');
      return;
    }

    if (users.some(u => u.username.toLowerCase() === newUsername.trim().toLowerCase())) {
      alert('ERR-DUP-001: A user with this username already exists.');
      return;
    }

    const newUserObj = {
      userId: `usr-new-${Date.now()}`,
      username: newUsername.trim(),
      email: newEmail.trim(),
      fullName: newUsername.trim(),
      roleId: `ROL-GEN`,
      roleName: newRole,
      department: 'Academic Operations',
      isActive: true,
      lastLogin: 'Never'
    };

    setUsers([...users, newUserObj]);
    dataService.addAuditLog({
      actorUserId: currentUser?.username || 'sys_admin',
      action: 'USER_CREATE',
      entityAffected: 'Users',
      entityId: newUsername.trim(),
      result: 'SUCCESS'
    });

    setShowCreateModal(false);
    setNewUsername('');
    setNewEmail('');
    setSuccessNotice(`Provisioned new platform account: ${newUserObj.username} (${newRole}).`);
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (roleFilter !== 'ALL' && u.roleName !== roleFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">SCR-012: User Management & Role Administration</h1>
          <p className="page-subtitle">
            Administers User Account Lifecycles, RBAC Role Assignments, Security Policies & Access States
          </p>
        </div>
        <div className="page-actions">
          {!isReadOnly && (
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary btn-sm">
              + Create User Account
            </button>
          )}
        </div>
      </div>

      {successNotice && (
        <div className="alert-banner alert-success">
          <div>✓ {successNotice}</div>
        </div>
      )}

      {/* FILTER & SEARCH STRIP */}
      <div className="filter-strip">
        <div className="filter-group" style={{ flex: 1, maxWidth: '320px' }}>
          <label className="filter-label">Search Users</label>
          <input
            type="text"
            className="form-input"
            placeholder="Search by username, email, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Filter by Primary Role</label>
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles (Global Directory)</option>
            <option value="Student">Student</option>
            <option value="Mentor">Mentor</option>
            <option value="Faculty">Faculty</option>
            <option value="Department User">Department User</option>
            <option value="Academic Administrator">Academic Administrator</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="ML Engineer">ML Engineer</option>
            <option value="System Administrator">System Administrator</option>
            <option value="Auditor / Viewer">Auditor / Viewer</option>
          </select>
        </div>
      </div>

      {/* USER DIRECTORY TABLE */}
      <div className="saap-card">
        <div className="saap-card-header">
          <h2 className="saap-card-title">Institutional User Directory</h2>
          <span style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
            Showing {filteredUsers.length} Users
          </span>
        </div>

        <div className="table-container">
          <table className="saap-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Full Name</th>
                <th>Institutional Email</th>
                <th>Primary Role</th>
                <th>Account Status</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.userId}>
                  <td><code>{u.username}</code></td>
                  <td><strong>{u.fullName}</strong></td>
                  <td>{u.email}</td>
                  <td><span className="badge badge-info">{u.roleName}</span></td>
                  <td>
                    <span className={`badge ${u.isActive ? 'badge-normal' : 'badge-danger'}`}>
                      {u.isActive ? 'ACTIVE' : 'SUSPENDED'}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--slate-500)' }}>{u.lastLogin}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleEditRoles(u)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        disabled={isReadOnly}
                      >
                        Edit Roles
                      </button>
                      <button
                        onClick={() => handleToggleLock(u)}
                        className={`btn ${u.isActive ? 'btn-danger' : 'btn-secondary'} btn-sm`}
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        disabled={isReadOnly}
                      >
                        {u.isActive ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ASSIGN ROLES & PERMISSIONS */}
      {editingUser && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2 className="modal-title">Assign Roles & Permissions — {editingUser.username}</h2>
              <button onClick={() => setEditingUser(null)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '14px' }}>
                <div><strong>User:</strong> {editingUser.fullName} ({editingUser.email})</div>
                <div style={{ fontSize: '12px', color: 'var(--slate-500)' }}>Dept: {editingUser.department}</div>
              </div>

              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="account-status-toggle"
                  checked={isActiveStatus}
                  onChange={(e) => setIsActiveStatus(e.target.checked)}
                />
                <label htmlFor="account-status-toggle" style={{ fontSize: '13px', fontWeight: 600 }}>
                  Account Active (Uncheck to suspend platform access)
                </label>
              </div>

              <div className="filter-label" style={{ marginBottom: '8px' }}>
                Assigned RBAC Roles (Table 4 Access Matrix):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Student',
                  'Mentor',
                  'Faculty',
                  'Department User',
                  'Academic Administrator',
                  'Data Analyst',
                  'ML Engineer',
                  'System Administrator',
                  'Auditor / Viewer'
                ].map((role) => (
                  <label key={role} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => handleToggleRole(role)}
                    />
                    <span>{role}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setEditingUser(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleSaveRoleAssignments} className="btn btn-primary">
                Save Role Assignments
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE USER */}
      {showCreateModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2 className="modal-title">Provision New User Account</h2>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="modal-body">
                <div className="filter-group" style={{ marginBottom: '12px' }}>
                  <label className="filter-label">Username</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="e.g. j_doe"
                    required
                  />
                </div>
                <div className="filter-group" style={{ marginBottom: '12px' }}>
                  <label className="filter-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. j.doe@ssitm.ac.in"
                    required
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">Initial Role Assignment</label>
                  <select
                    className="form-select"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="Faculty">Faculty</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Student">Student</option>
                    <option value="Department User">Department User</option>
                    <option value="Academic Administrator">Academic Administrator</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="ML Engineer">ML Engineer</option>
                    <option value="Auditor / Viewer">Auditor / Viewer</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
