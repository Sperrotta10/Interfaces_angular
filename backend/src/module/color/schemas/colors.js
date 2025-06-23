
export function defineColors(sequelize, DataTypes) {

    const Colors = sequelize.define('Colors', {
        colors_id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true,
        },
        color_one : {
            type : DataTypes.STRING,
            allowNull : false,

        },
        color_two : {
            type : DataTypes.STRING,
            allowNull : false,

        },
        color_three : {
            type : DataTypes.STRING,
            allowNull : false,

        },
        color_four : {
            type : DataTypes.STRING,
            allowNull : false,

        },
        color_five : {
            type : DataTypes.STRING,
            allowNull : false,

        }
    }, {
        tableName : "Colors",
    })

    return Colors;
}