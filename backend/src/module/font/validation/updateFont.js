import zod from "zod";

const ValidationFont = zod.object({
    title : zod.number().nonnegative({message : "El tamaño de letra del titulo tiene que ser un numero positivo"}).optional(),
    sub_title: zod.number().nonnegative({message : "El tamaño de letra del subtitulo tiene que ser un numero positivo"}).optional(),
    paragraph: zod.number().nonnegative({message : "El tamaño de letra del parrafo tiene que ser un numero positivo"}).optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: "Al menos un campo debe ser actualizado",
})

export function updateValidationFont(data) {
    return ValidationFont.safeParse(data);
}