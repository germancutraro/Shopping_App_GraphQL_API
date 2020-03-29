const { forwardTo } = require('prisma-binding');

const Query = {
  items: forwardTo('db')
  /*async items(_, args, ctx) {
    const results = await ctx.db.query.items();

    return results;
  }*/
};

module.exports = Query;
