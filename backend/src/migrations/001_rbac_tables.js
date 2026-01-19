import { query } from "../config/db.js";

const createRolesPermissionsGroups = async () => {
  /* ================= ROLES ================= */
  const rolesSql = `
    CREATE TABLE IF NOT EXISTS roles (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  /* ================= PERMISSION GROUPS ================= */
  const permissionGroupsSql = `
    CREATE TABLE IF NOT EXISTS permission_groups (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) UNIQUE NOT NULL,
      slug VARCHAR(150) UNIQUE NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  /* ================= PERMISSIONS ================= */
  const permissionsSql = `
    CREATE TABLE IF NOT EXISTS permissions (
      id SERIAL PRIMARY KEY,
      permission_group_id INT NOT NULL
        REFERENCES permission_groups(id)
        ON DELETE CASCADE,
      label VARCHAR(100) NOT NULL,
      name VARCHAR(150) UNIQUE NOT NULL,
      guard_name VARCHAR(100) NOT NULL DEFAULT 'store',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  /* ================= ROLE PERMISSIONS (PIVOT) ================= */
  const rolePermissionsSql = `
    CREATE TABLE IF NOT EXISTS role_permissions (
      id SERIAL PRIMARY KEY,
      role_id INT NOT NULL
        REFERENCES roles(id)
        ON DELETE CASCADE,
      permission_id INT NOT NULL
        REFERENCES permissions(id)
        ON DELETE CASCADE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE (role_id, permission_id)
    );
  `;

  /* ================= INDEXES ================= */
  const indexesSql = `
    CREATE INDEX IF NOT EXISTS idx_permissions_group
      ON permissions(permission_group_id);

    CREATE INDEX IF NOT EXISTS idx_role_permissions_role
      ON role_permissions(role_id);

    CREATE INDEX IF NOT EXISTS idx_role_permissions_permission
      ON role_permissions(permission_id);
  `;

  /* ================= UPDATED_AT TRIGGER ================= */
  const triggerFnSql = `
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `;

  const triggerSql = `
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_roles'
      ) THEN
        CREATE TRIGGER set_updated_at_roles
        BEFORE UPDATE ON roles
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_permission_groups'
      ) THEN
        CREATE TRIGGER set_updated_at_permission_groups
        BEFORE UPDATE ON permission_groups
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_permissions'
      ) THEN
        CREATE TRIGGER set_updated_at_permissions
        BEFORE UPDATE ON permissions
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      END IF;
    END
    $$;
  `;

  /* ================= EXECUTION ORDER ================= */
  await query(rolesSql);
  await query(permissionGroupsSql);
  await query(permissionsSql);
  await query(rolePermissionsSql);
  await query(indexesSql);
  await query(triggerFnSql);
  await query(triggerSql);

  console.log(
    "✅ RBAC tables, indexes & triggers created successfully"
  );
};

export default createRolesPermissionsGroups;
