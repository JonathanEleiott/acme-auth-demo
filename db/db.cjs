const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const connection = new Client('postgres://localhost:5432/acme_auth_demo');
require('dotenv').config()

const getUserByToken = async(token) => {
  try {
    const { id } = jwt.verify(token, process.env.secret);
    const { rows: [ user ] } = await connection.query(`
      SELECT *
      FROM users
      WHERE id=${id};
    `);
    if(user) {
      return user;
    } else {
      const error = new Error('bad credentials');
      error.status = 401;
      throw error;
    }
  } catch(err) {
    const error = new Error('bad credentials');
    error.status = 401;
    throw error;
  }
  
}

const getUser = async({ username, password }) => {
  try {
    const { rows: [ user ] } = await connection.query(`
      SELECT *
      FROM users
      WHERE username='${username}'
      AND password='${password}';
    `);

    if(user) {
      const assignedToken = jwt.sign({id: user.id}, process.env.secret);
      return assignedToken;
    } else {
      const error = new Error('bad credentials');
      error.status = 401;
      throw error;
    }
  } catch(err) {
    const error = new Error('bad credentials');
    error.status = 401;
    throw error;
  }
}

const syncAndSeed = async() => {
  try {
    await connection.connect();
    console.log(`CONNECTED TO THE DB`);

    await connection.query(`
      DROP TABLE IF EXISTS users;

      CREATE TABLE users (
        Id SERIAL PRIMARY KEY,
        Username VARCHAR(30) UNIQUE,
        Password VARCHAR(30) NOT NULL
      );

      INSERT INTO users(Username, Password) VALUES('curly', 'curly_pw');
      INSERT INTO users(Username, Password) VALUES('moe', 'moe_pw');
      INSERT INTO users(Username, Password) VALUES('larry', 'larry_pw');
      INSERT INTO users(Username, Password) VALUES('lucy', 'lucy_pw');
    `);

    console.log(`TABLES CREATED AND SEEDED!`);

  } catch(error) {
    console.log(error);
  }
}

syncAndSeed();

module.exports = {
  getUser, 
  getUserByToken
}


