import React from 'react';
import EntityManagement from '../components/common/EntityManagement';
import { fetchAllUsers, updateUser, deleteUser } from '../services/UserService';

const UsersManagement = () => {

  const transformEntityForEdit = (user) => {
    return Object.fromEntries(
      Object.entries(user)
        .filter(([_, value]) => typeof value !== 'object' || value === null)
        .map(([key, value]) => [key, value || ''])
    );
  }

  return (
    <EntityManagement
      title="Usuarios"
      entityType="users"
      fetchEntities={fetchAllUsers}
      updateEntity={updateUser}
      deleteEntity={deleteUser}
      backPath="/admin"
      transformEntityForEdit={transformEntityForEdit}
    />
  );
};

export default UsersManagement;