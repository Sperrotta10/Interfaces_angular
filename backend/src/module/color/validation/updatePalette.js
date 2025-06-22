import zod from "zod";

const validationPalette = zod.object({
    name: zod.string().min(3, { message: "El nombre de la paleta es requerido" }).max(50, { message: "El nombre de la paleta no puede tener mas de 50 caracteres" }),
})

export function updateValidationPalette(data) {
    return validationPalette.safeParse(data);
}