import sequelize from './database.js';

const initDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database & tables created!');
  } catch (error) {
    console.error('Error creating database:', error);
  }
  finally {
    await sequelize.close();
  }
};

initDatabase();