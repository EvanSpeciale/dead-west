import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Evan Speciale",
    email: "evan@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Emma Speciale",
    email: "emma@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
