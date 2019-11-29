const keyMirror = require('keymirror');

const PERMISSIONS = keyMirror({READ: null, WRITE: null});

const roles = {
  admin: {
    permissions: [PERMISSIONS.READ, PERMISSIONS.WRITE]
  }
};

async function hasPermission(role, operation) {
  return roles[role] && roles[role].permissions.indexOf(operation) !== -1;
}

module.exports = {
  PERMISSIONS,
  roles,
  hasPermission
};