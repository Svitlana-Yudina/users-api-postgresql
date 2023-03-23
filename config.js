const env = process.env;

export const config = {
  db: {
    host: env.DB_HOST || 'trumpet.db.elephantsql.com',
    port: env.DB_PORT || '5432',
    user: env.DB_USER || 'qcewziyl',
    password: env.DB_PASSWORD || 'E4tFnzlQHFhd_aLwuFHfWGuH7fXPZGTk',
    database: env.DB_NAME || 'qcewziyl',
  },
};
