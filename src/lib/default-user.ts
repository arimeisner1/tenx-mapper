import { prisma } from "@/lib/prisma";

const DEFAULT_USER_EMAIL = "admin@tenxmapper.com";

export async function getDefaultUser() {
  let user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: DEFAULT_USER_EMAIL,
        name: "Admin",
        password: "disabled",
      },
    });
  }

  return user;
}
