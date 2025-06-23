import { sequelize } from "../../../config/dataBase.js";
import { Palette, Colors } from "../../../models/tables.js";

export class ModelPaletteColor {

    static async getAllPalette() {

        try {

            const palette = await Palette.findAll({
                include : {
                    model : Colors,
                    as : 'colors'
                }
            });

            return {message : "Paletas obtenidas", data : palette};
            
        } catch (error) {
            console.error("Error al obtener las paletas");
            throw error;
        }
    
    }
    
    static async getIdPalette(palette_id) {
        
        try {

            const palette = await Palette.findByPk(palette_id,{
                include : {
                    model : Colors,
                    as : 'colors'
                }
            });

            if(palette) {
                return {message : "Paleta obtenida", data : palette};
            } else {
                return {message : "La paleta no existe", data : palette, status : 404};
            }
            
        } catch (error) {
            console.error("Error al obtener la paleta");
            throw error;
        }
    }

    static async createPalette(data) {

        const t = await sequelize.transaction();

        try {

            const colors = await Colors.create(data.colors, {transaction: t});

            const newPalette = {
                name : data.name, 
                colors_id : colors.colors_id}

            const palette = await Palette.create(newPalette, {transaction: t});

            await t.commit();

            return { message : "Paleta creada", data : {palette, colors}};

        } catch (error) {

            await t.rollback();
            console.error("Error al crear paleta", error);
            throw error;
        }
        
    }


    static async updatePalette(palette_id, data) {
        
        try {

            const exist = await Palette.findByPk(palette_id);
            if(!exist) return {message : "Paleta no encontrado", status : 404}

            await Palette.update(data,{where : {palette_id : palette_id}});

            return {message : "Paleta actualizada"}

        } catch (error) {
            console.error("Error al actualizar la paleta");
            throw error;
        }
    }

    static async updateColors(colors_id, data) {
        
        try {

            const exist = await Colors.findByPk(colors_id);
            if(!exist) return {message : "Colores no encontrado", status : 404}

            await Colors.update(data,{where : {colors_id : colors_id}});

            return {message : "Colores actualizado"}

        } catch (error) {
            console.error("Error al actualizar los colores");
            throw error;
        }
    }

    static async deletePaletteColor(colors_id) {
        
        try {

            const exist = await Colors.findByPk(colors_id);
            if(!exist) return {message : "Paleta de colores no encontrado", status : 404}

            await Colors.destroy({where : {colors_id : colors_id}});

            return {message : "Paleta de colores eliminado"}

        } catch (error) {
            console.error("Error al eliminar la paleta de colores");
            throw error;
        }
    }
}