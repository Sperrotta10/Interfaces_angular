
export function defineUser(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Role',
        key: 'role_id',
      }
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maidenName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    eyeColor: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Campos del objeto "hair"
    hair_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hair_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    ip: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Campos del objeto "address"
    address_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address_city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address_state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address_stateCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address_postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address_coordinates_lat: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    address_coordinates_lng: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    address_country: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    macAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    university: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Campos del objeto "bank"
    bank_cardExpire: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_cardNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_cardType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_iban: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Campos del objeto "company"
    company_department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    company_address_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_address_city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_address_state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_address_stateCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_address_postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_address_coordinates_lat: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    company_address_coordinates_lng: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    company_address_country: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    ein: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ssn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Campos del objeto "crypto"
    crypto_coin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    crypto_wallet: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    crypto_network: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'User',
    hooks: {
      afterCreate: (user, options) => {
        user.password = undefined;
        user.role_id = undefined;
      }
    },
    indexes: [
      { fields: ['user_name'] },
      { fields: ['email'] }
    ]
  });

  return User;
}
