import { ModelPaletteColor } from "../model/color.js";
import { createValidationPalette } from "../validation/create.js";
import { updateValidationColors } from "../validation/updateColors.js";
import { updateValidationPalette } from "../validation/updatePalette.js";

export class ControllerPaletteColor {

    static async getAllPalette(req, res) {

        try {

            const palette = await ModelPaletteColor.getAllPalette();

            return res.status(200).json({message : palette.message, data : palette.data});

        } catch (error) {
            return res.status(500).json({message : "Error interno del servidor", error : error.message});
        }
    }

    static async getIdPalette(req, res) {
        
        const { palette_id } = req.params; 
        console.log(palette_id);

        try {

            const palette = await ModelPaletteColor.getIdPalette(palette_id);

            if( palette.status === 404) {   
                return res.status(palette.status).json({message : palette.message});
            }

            return res.status(200).json({message : palette.message, data : palette.data});

        } catch (error) {
            return res.status(500).json({message : "Error interno del servidor", error : error.message});
        }
    }

    static async createPalette(req, res) {
        
        const result = createValidationPalette(req.body)

        if(!result.success) return res.status(400).json({message : "Error en la validacion de los datos", error : result.error.errors});

        try {

            const palette = await ModelPaletteColor.createPalette(result.data);

            return res.status(201).json({message : palette.message, data : palette.data});

        } catch (error) {
            return res.status(500).json({message : "Error interno del servidor", error : error.message});
        }
    }


    static async updatePalette(req, res) {
        
        const result = updateValidationPalette(req.body)
        const { palette_id } = req.params;

        if(!result.success) return res.status(400).json({message : "Error en la validacion de los datos", error : result.error.errors});

        try {

            const palette = await ModelPaletteColor.updatePalette(palette_id, result.data);

            if( palette.status === 404) {
                return res.status(palette.status).json({message : palette.message});
            }

            return res.status(204).json({message : palette.message});

        } catch (error) {
            return res.status(500).json({message : "Error interno del servidor", error : error.message});
        }
    }

    static async updateColors(req, res) {
        
        const result = updateValidationColors(req.body);
        const { colors_id } = req.params;

        if(!result.success) return res.status(400).json({message : "Error en la validacion de los datos", error : result.error.errors});

        try {

            const colors = await ModelPaletteColor.updateColors(colors_id, result.data);

            if( colors.status === 404) {
                return res.status(colors.status).json({message : colors.message});
            }

            return res.status(204).json({message : colors.message});

        } catch (error) {
            return res.status(500).json({message : "Error interno del servidor", error : error.message});
        }
    }

    static async deletePaletteColor(req, res) {
        
        const { colors_id } = req.params;

        try {

            const colors = await ModelPaletteColor.deletePaletteColor(colors_id);

            if( colors.status === 404) {
                return res.status(colors.status).json({message : colors.message});
            }

            return res.status(204).json({message : colors.message});

        } catch (error) {
            return res.status(500).json({message : "Error interno del servidor", error : error.message});
        }
    }
}