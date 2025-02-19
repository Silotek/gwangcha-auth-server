import { User } from "@prisma/client";

export const user = (user: User) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedUserId: user.deletedUserId
  };
};
