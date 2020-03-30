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
  },

  async deleteItem(_, args, ctx, info) {
    const where = { id: args.id };
    // exist item?
    const item = await ctx.db.query.item({ where }, info);
    // TODO user permission
    if (item) return await ctx.db.mutation.deleteItem({ where }, info);
  }
};

module.exports = Mutations;
