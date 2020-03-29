const Mutations = {
  async createItem(_, args, ctx, info) {
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );

    return item;
  },
  async updateItem(_, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;

    const item = await ctx.db.mutation.updateItem(
      {
        data: updates,
        where: { id: args.id }
      },
      info
    );

    return item;
  }
};

module.exports = Mutations;
