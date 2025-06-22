
export function defineRole(sequelize, DataTypes) {
 
    const Role = sequelize.define('Role', {
        role_id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true,
        },
        name : {
            type : DataTypes.STRING,
            allowNull : false,
        },
    }, {
        tableName : 'Role',
        timestamps: false,
    })

    return Role;
}