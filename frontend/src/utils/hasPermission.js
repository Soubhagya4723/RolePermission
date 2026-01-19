export const hasPermission = (permission) => {
  const permissions =
    JSON.parse(localStorage.getItem("permissions")) || {};

  const role = localStorage.getItem("role");

  // Admin → full access
  if (role === "admin") return true;

  return permissions[permission] === true;
};
