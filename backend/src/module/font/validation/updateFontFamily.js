import zod from "zod";

const validationFontFamily = zod.object({
    name_principal : zod.string().min(3, {message : "El nombre principal de la fuente es requerido"}).max(50, {message : "El nombre principal de la fuente no puede tener mas de 50 caracteres"}).optional(),
    url_principal: zod.string().min(1, {message : "La url principal de la fuente es requerida"}).optional(),
    name_secundary: zod.string().min(3, {message : "El nombre secundario de la fuente es requerido"}).max(50, {message : "El nombre secundario de la fuente no puede tener mas de 50 caracteres"}).optional(),
    url_secondary: zod.string().min(1, {message : "La url secundaria de la fuente es requerida"}).optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: "Al menos un campo debe ser actualizado",
});

export function updateValidationFontFamily(data) {
    return validationFontFamily.safeParse(data);
}