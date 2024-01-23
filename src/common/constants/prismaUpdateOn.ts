export const PrismaUpdateOn = {
  course: {
    event: {
      createLike: {
        totalLikes: {
          increment: 1,
        },
      },
      deleteLike: {
        totalLikes: {
          decrement: 1,
        },
      },
    },
  },
};
