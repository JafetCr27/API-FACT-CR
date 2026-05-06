const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async ({ name, email, password, companyId, role }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      companies: {
        create: {
          companyId,
          role: role || "admin"
        }
      }
    }
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status
  };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      companies: {
        include: {
          company: true
        }
      }
    }
  });

  if (!user) throw new Error("Invalid credentials");

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new Error("Invalid credentials");

  // 👉 tomamos la primera empresa (luego puedes mejorar esto)
  const userCompany = user.companies[0];

  const token = jwt.sign(
    {
      userId: user.id,
      companyId: userCompany.companyId,
      role: userCompany.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      companyId: userCompany.companyId,
      role: userCompany.role
    }
  };
};

module.exports = {
  register,
  login
};