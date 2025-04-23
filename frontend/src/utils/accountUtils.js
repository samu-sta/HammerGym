export const redirectToAccount = (account) => {
  const urlAccountRole = {
    'user': '/usuario',
    'admin': '/admin',
    'trainer': '/entrenador',
  }

  return urlAccountRole[account.role] || '/login';
}