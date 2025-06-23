import zod from "zod";

const validationColors = zod.object({
    color_one: zod.string().min(7, { message: "El color uno es requerido" }).max(7, { message: "El color uno debe tener 7 caracteres" }).optional(),
    color_two: zod.string().min(7, { message: "El color dos es requerido" }).max(7, { message: "El color dos debe tener 7 caracteres" }).optional(),   
    color_three: zod.string().min(7, { message: "El color tres es requerido" }).max(7, { message: "El color tres debe tener 7 caracteres" }).optional(),
    color_four: zod.string().min(7, { message: "El color cuatro es requerido" }).max(7, { message: "El color cuatro debe tener 7 caracteres" }).optional(),
    color_five: zod.string().min(7, { message: "El color cinco es requerido" }).max(7, { message: "El color cinco debe tener 7 caracteres" }).optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: "Al menos un campo debe ser actualizado",
});

export function updateValidationColors(data) {
    return validationColors.safeParse(data);
}