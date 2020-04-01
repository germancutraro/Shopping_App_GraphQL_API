const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  },

  async signUp(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] }
        }
      },
      info
    );
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    });
    return user;
  },

  async signIn(_, { email, password }, ctx, info) {
    const user = await ctx.db.query.user(
      { where: { email: email.toLowerCase() } },
      info
    );
    if (!user) throw new Error('Invalid Credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid Password!');
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    });
    return user;
  }
};

module.exports = Mutations;
