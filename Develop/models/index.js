// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'product_id',
});

// Products belongToMany Tags (through ProductTag)
Product.belongsTo(Tag, {
  through: {
    model: ProductTag,
    unique: false
  },
  foreignKey: 'tag_id',
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsTo(Product, {
  through: {
    model: ProductTag,
    unique: false
  },
  foreignKey: 'product_id',
});

module.exports = { Product, Tag, Category };

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
