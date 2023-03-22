export function isUserValid({
  username,
  first_name,
  last_name,
  email,
  role,
  state,
}) {
  if (role !== 'user' && role !== 'admin') {
    return false;
  }

  if (state !== 'male' && state !== 'female') {
    return false;
  }

  if (typeof username !== 'string' || username.length < 3) {
    return false;
  }

  if (typeof first_name !== 'string' || first_name.length < 3) {
    return false;
  }

  if (typeof last_name !== 'string' || last_name.length < 3) {
    return false;
  }

  if (typeof email !== 'string'
    || !email.includes('@')
    || email.length < 14
  ) {
    return false;
  }

  return true;
}
