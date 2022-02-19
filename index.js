const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products (A) belongsTo Category (B)
Product.belongsTo(Category);

// Categories have many Products
Category.hasMany(Product);

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany( Tag, { through: ProductTag } );

// Tags belongToMany Tags (through ProductTag)
Product.belongsToMany( Tag, { through: ProductTag } );

module.exports = {
    Product,
    Category,
    Tag,
    ProductTag,
};