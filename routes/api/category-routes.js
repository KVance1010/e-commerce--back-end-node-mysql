const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
router.get('/', async (req, res) => {
	try {
		const categoryProduct = await Category.findAll({
			include: [{ model: Product }],
		});
		res.json(categoryProduct);
	} catch (err) {
		res.json(err);
	}
});

router.get('/:id', async (req, res) => {
	try {
		const catProdId = await Category.findByPk(req.params.id, {
			include: [{ model: Product }],
		});
		if (!catProdId ) {
			res.json({ message: 'No Category found' });
			return;
		}
		res.json(catProdId);
	} catch (err) {
		res.json(err);
	}
});

// create a new category
router.post('/', async (req, res) => {
	try {
		await Category.create({category_name: req.body.category_name});
		res.json({ message: "Created successfully"});
	} catch (err) {
		res.json(err);
	}
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
	try {
		await Category.update(
			{
				category_name: req.body.category_name,
			},
			{
				where: {
					id: req.params.id,
				},
			}
		);
		res.json({ message: "Updated successfully"});
	} catch (err) {
		res.json(err);
	}
});

// delete a category by its `id` value
router.delete('/:id', async (req, res) => {
	try {
		const categoryDelete = await Category.destroy({where: {id: req.params.id}});
		if (!categoryDelete) {
			res.json({ message: 'Deleted already' });
			return;
		}
		res.json({ message: "Deleted successfully"});
	} catch (err) {
		res.json(err);
	}
});

module.exports = router;
