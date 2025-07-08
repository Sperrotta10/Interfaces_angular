
export function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole) {
            return res.status(403).json({ message: 'Acceso denegado. Rol no especificado.' });
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para acceder a esta ruta.' });
        }

        next();
    };
}