import {query} from './db.js';

export async function getAll() {
  try {
    const allUsers = await query(`
          SELECT
            users.id,
            users.username,
            profiles.first_name,
            profiles.last_name,
            users.email,
            users.role,
            profiles.state
          FROM users JOIN profiles
          ON users.profile_id = profiles.id
          ORDER BY users.id
        `);

    return allUsers;
  } catch (err) {
    throw new Error(`Something went wrong:( ${err}`);
  }
}

export async function getByRole(role) {
  try {
    const usersToSend = await query(`
          SELECT
            users.id,
            users.username,
            profiles.first_name,
            profiles.last_name,
            users.email,
            users.role,
            profiles.state
          FROM users JOIN profiles
          ON users.profile_id = profiles.id
          WHERE users.role = $1
          ORDER BY users.id
        `, [role]);
    return usersToSend;
  } catch (err) {
    throw new Error(`Something went wrong:( ${err}`);
  }
}

export async function getById(id) {
  try {
    const foundedUser = await query(`
    SELECT
      users.id,
      users.username,
      profiles.first_name,
      profiles.last_name,
      users.email,
      users.role,
      profiles.state
    FROM users JOIN profiles
    ON users.profile_id = profiles.id
    WHERE users.id = $1
  `, [Number(id)]);

  return foundedUser[0];
  } catch (err) {
    throw new Error(`Something went wrong:( ${err}`);
  }
}

export async function createNewUser({
  username,
  first_name,
  last_name,
  email,
  role,
  state,
}) {
  try {
    const newProfile_id = await query(`
      INSERT INTO public.profiles (
      first_name, last_name, state
      ) VALUES ($1, $2, $3)
      returning id`, [first_name, last_name, state]);

    const profile_id = newProfile_id[0].id;

    const newUserId = await query(`
      INSERT INTO public.users (
        username, email, role, profile_id
      ) VALUES ($1, $2, $3, $4)
      returning id`, [username, email, role, profile_id]
    );

    const user_id = newUserId[0].id;

    const createdUser = await query(`
      SELECT
        users.id,
        users.username,
        profiles.first_name,
        profiles.last_name,
        users.email,
        users.role,
        profiles.state
      FROM users JOIN profiles
      ON users.profile_id = profiles.id
      WHERE users.id = $1
    `, [user_id]);

    return createdUser[0];
  } catch (err) {
    throw new Error(`Something went wrong:( ${err}`);
  }
}

export async function findUserInDB(id) {
  try {
    const foundedUser = await query(`
      SELECT * FROM users
      WHERE users.id = $1
    `, [Number(id)]);

    return foundedUser[0];
  } catch (err) {
    throw new Error(`Something went wrong:( ${err}`);
  }
}

export async function remove(id, profId) {
  try {
    await query(`
      DELETE FROM users
      WHERE id = $1;
    `, [Number(id)]);

    await query(`
      DELETE FROM profiles
      WHERE id = $1;
    `, [profId]);
  } catch (err) {
    throw new Error(`Something went wrong:( ${err}`);
  }
}

export async function update(id, profId, user) {
  try {
    const {
      username,
      first_name,
      last_name,
      email,
      role,
      state,
    } = user;

    await query(`
      UPDATE users
      SET username = $1,
          email = $2,
          role = $3
      WHERE id = $4;
    `, [username, email, role, Number(id)]);

    await query(`
      UPDATE profiles
      SET first_name = $1,
          last_name = $2,
          state = $3
      WHERE id = $4;
    `, [first_name, last_name, state, profId]);

    const updatedUser = await query(`
      SELECT
        users.id,
        users.username,
        profiles.first_name,
        profiles.last_name,
        users.email,
        users.role,
        profiles.state
      FROM users JOIN profiles
      ON users.profile_id = profiles.id
      WHERE users.id = $1
    `, [Number(id)]);

    return updatedUser[0];

  } catch (err) {
    throw new Error(`Something went wrong:( ${err}`);
  }
}
