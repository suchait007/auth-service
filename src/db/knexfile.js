// knexfile.js
module.exports = {
      client: 'pg',
      connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'j5514kbELZ',
        database: 'retail_solution',
      },
      migrations: {
        directory: './migrations',
      },
      seeds: {
        directory: './seeds',
      },
  };
  