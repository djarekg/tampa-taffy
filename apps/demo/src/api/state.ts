import prisma from '@tt/db/client';

export const getStates = async () => {
  return prisma.state.findMany();
};
