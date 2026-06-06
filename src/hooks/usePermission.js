import { useSelector } from "react-redux";

/**
 * Custom hook to check if user has specific permission
 * @param {string|string[]} permission - Single permission or array of permissions to check
 * @returns {boolean} - True if user has the permission(s)
 */
export const usePermission = (permission) => {
  const permissions = useSelector((state) => state.Login?.permissions || []);

  if (!permission) return false;

  if (Array.isArray(permission)) {
    // Check if user has ANY of the permissions (OR logic)
    return permission.some((perm) => permissions.includes(perm));
  }

  return permissions.includes(permission);
};

/**
 * Custom hook to check if user has ALL of the specified permissions
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean} - True if user has all permissions
 */
export const useHasAllPermissions = (permissionsToCheck) => {
  const permissions = useSelector((state) => state.Login?.permissions || []);

  if (!Array.isArray(permissionsToCheck) || permissionsToCheck.length === 0) return false;

  return permissionsToCheck.every((perm) => permissions.includes(perm));
};

/**
 * Custom hook to get list of permissions
 * @returns {array} - Array of user permissions
 */
export const useGetPermissions = () => {
  return useSelector((state) => state.Login?.permissions || []);
};
