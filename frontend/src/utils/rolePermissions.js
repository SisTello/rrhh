import { useEffect, useState } from "react";

import { initialRoles, initialUsers } from "../pages/administrator/administratorData";

export const rolePermissionsStorageKey = "tello-role-permissions";

export const loadRolePermissions = () => {
    try {
        const storedRoles = window.localStorage.getItem(rolePermissionsStorageKey);
        if (!storedRoles) return initialRoles;

        const parsedRoles = JSON.parse(storedRoles);
        if (!Array.isArray(parsedRoles)) {
            throw new Error("Los permisos guardados no tienen un formato válido.");
        }

        return initialRoles.map((role) => {
            const storedRole = parsedRoles.find((item) => item.id === role.id);
            return storedRole && Array.isArray(storedRole.permissions)
                ? { ...role, permissions: storedRole.permissions }
                : role;
        });
    } catch (error) {
        console.error("No se pudieron cargar los permisos de los roles.", error);
        return initialRoles;
    }
};

export const saveRolePermissions = (roles) => {
    window.localStorage.setItem(rolePermissionsStorageKey, JSON.stringify(roles));
    window.dispatchEvent(new Event("tello:role-permissions-updated"));
};

export const useRolePermissions = () => {
    const [roles, setRoles] = useState(loadRolePermissions);

    useEffect(() => {
        const refreshRoles = () => setRoles(loadRolePermissions());
        window.addEventListener("storage", refreshRoles);
        window.addEventListener("tello:role-permissions-updated", refreshRoles);
        return () => {
            window.removeEventListener("storage", refreshRoles);
            window.removeEventListener("tello:role-permissions-updated", refreshRoles);
        };
    }, []);

    return roles;
};

export const getUserPermissions = (roles, email) => {
    const user = initialUsers.find((item) => item.email === email);
    if (!user) return new Set();

    return new Set(
        user.roleIds
            .map((roleId) => roles.find((role) => role.id === roleId))
            .filter((role) => role?.status === "Activo")
            .flatMap((role) => role.permissions),
    );
};
