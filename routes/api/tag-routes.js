const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// find all tags
router.get('/', async (req, res) => {
	try {
		const productTag = await Tag.findAll({
			include: [{ model: Product, through: ProductTag }],
		});
		res.json(productTag);
	} catch (err) {
		res.json(err);
	}
});

// find a single tag by its `id`
router.get('/:id', async (req, res) => {
	try {
		const productTag = await Tag.findByPk(req.params.id, {
			include: [{ model: Product, through: ProductTag }],
		});
		res.json(productTag);
	} catch (err) {
		res.json(err);
	}
});

// create a new tag
router.post('/', (req, res) => {
// Tag.create(req.body).then((tag)=>
// res.status(200).json(tag)).catch((err)=> res.status(404).json(err));

  Tag.create(req.body)
  .then((tag) => {
    if (req.body.productIds.length) {
      const productTagIdArr = req.body.productIds.map((product_id) => {
        return {
          tag_id: tag.id,
          product_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
    // if no product tags, just respond
    res.json({ message: "Created successfully"});
  })
  .then((productTagIds) => res.json({ message: "Created successfully"}))
  .catch((err) => {
    console.log(err);
    res.json(err);
  });

	// try {
	// 	const newTag = await Tag.create(req.body);
	// 	if (req.body.productIds.length) {
	// 		const productTagIdArr = req.body.productIds.map((product_id) => {
	// 			return {
	// 				tag_id: newTag.id,
	// 				product_id,
	// 			};
	// 		});
	// 		return ProductTag.bulkCreate(productTagIdArr);
	// 	}
	// 	res.json({ message: 'Created successfully' });
	// } catch (err) {
	// 	res.json(err);
	// }
});

// update a tag
router.put('/:id', async(req, res) => {
	try {
    await Tag.update(req.body, {
     where: {
       id: req.params.id,
     },
   });
   const prodTags = await ProductTag.findAll({
     where: { tag_id: req.params.id },
   });
   if (prodTags) {
     const productTagIds = prodTags.map(({ product_id }) => product_id);
     const newProductTags = req.body.productIds
       .filter((product_id) => !productTagIds.includes(product_id))
       .map((product_id) => {
         return {
           tag_id: req.params.id,
           product_id,
         };
       });
     // figure out which ones to remove
     const tagsToRemove = prodTags
       .filter(({ product_id }) => !req.body.productIds.includes(product_id))
       .map(({ id }) => id);

     await ProductTag.destroy({ where: { id: tagsToRemove } });
     await ProductTag.bulkCreate(newProductTags);
     res.json({ message: "Updated successfully"});
   }
 } catch (err) {
   res.json(err);
 }
});

// delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
	try {
		const tagsDelete = await Tag.destroy({ where: { id: req.params.id } });
		if (!tagsDelete) {
			res.json({ message: 'Deleted already' });
			return;
		}
		res.json({ message: 'Deleted successfully' });
	} catch (err) {
		res.json(err);
	}
});

module.exports = router;
