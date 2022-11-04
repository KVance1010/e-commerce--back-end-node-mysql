// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
	foreignKey: 'category_id',
	onDelete: 'CASCADE'
});

// Categories have many Products
Category.hasMany(Product, {
	foreignKey: 'category_id',
});

Product.belongsToMany(Tag, {
	through: ProductTag,
	foreignKey: 'product_id',
	otherKey: 'tag_id',
	// unique: false
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
	through: ProductTag,
	foreignKey: 'tag_id',
	otherKey: 'product_id',
	// unique: false
	//through: {
// 		modal: ProductTag,
// 		unique: false,
// }
});

module.exports = {
	Product,
	Category,
	Tag,
	ProductTag,
};
