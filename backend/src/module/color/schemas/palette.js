
export function definePalette(sequelize, DataTypes) {

    const Palette = sequelize.define('Palette', {
        palette_id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true,
        },
        name : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        colors_id : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references : {
                model : 'Colors',
                key : 'colors_id'
            }
        }
    }, {
        tableName : "Palette",
    })

    return Palette;
}