INSERT INTO users (
  employee_id,
  username,
  email,
  phone,
  password_hash,
  role,
  status,
  first_name,
  last_name,
  department,
  designation,
  join_date
) VALUES (
  'ADMIN001',
  'admin',
  'admin@company.com',
  '09695113367',
  '$2a$10$Z0.p9H8K9M6n8q0Yk4J0u.8X7w6v5t4r3s2p1o0n9m8l7k6j5i4h',
  'admin',
  'active',
  'Admin',
  'User',
  'IT',
  'Administrator',
  CURRENT_DATE
);