import zod from "zod";

const validationColors = zod.object({
    color_one: zod.string().min(7, { message: "El color uno es requerido" }).max(7, { message: "El color uno debe tener 7 caracteres" }),
    color_two: zod.string().min(7, { message: "El color dos es requerido" }).max(7, { message: "El color dos debe tener 7 caracteres" }),   
    color_three: zod.string().min(7, { message: "El color tres es requerido" }).max(7, { message: "El color tres debe tener 7 caracteres" }),
    color_four: zod.string().min(7, { message: "El color cuatro es requerido" }).max(7, { message: "El color cuatro debe tener 7 caracteres" }),
    color_five: zod.string().min(7, { message: "El color cinco es requerido" }).max(7, { message: "El color cinco debe tener 7 caracteres" }),
})

const validationPalette = zod.object({
    name: zod.string().min(3, { message: "El nombre de la paleta es requerido" }).max(50, { message: "El nombre de la paleta no puede tener mas de 50 caracteres" }),
    colors : validationColors,
})

export function createValidationPalette(data) {
    return validationPalette.safeParse(data);
}