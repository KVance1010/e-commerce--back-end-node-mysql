const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
		const productCatTag = await Product.findAll({
			include: [{ model: Category },{ model: Tag}],
		});
		res.json(productCatTag);
	} catch (err) {
		res.status(500).json(err);
	}
});

// get one product
router.get('/:id', async (req, res) => {
  try {
		const productTag = await Product.findByPk(req.params.id, {
			include: [{ model: Category },{ model: Tag}],
		});
		res.json(productTag);
	} catch (err) {
		res.status(500).json(err);
	}
});

// create new product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.json(product);
    })
    .then((productTagIds) => res.json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.json(err);
    });
});

 // delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
		const categoryDelete = await Category.destroy({where: {id: req.params.id}});
		if (!categoryDelete) {
			res.json({ message: 'No library card found with that id!' });
			return;
		}
		res.json("Deleted successfully");
	} catch (err) {
		res.json(err);
	}
});

module.exports = router;
