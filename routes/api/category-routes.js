const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
router.get('/', async (req, res) => {
	try {
		const categoryProduct = await Category.findAll({
			include: [{ model: Product }],
		});
		res.status(200).json(categoryProduct);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get('/:id', async (req, res) => {
	try {
		const categoryProduct = await Category.findByPk(req.params.id, {
			include: [{ model: Product }],
		});
		if (!categoryProduct) {
			res.status(404).json({ message: 'No library card found with that id!' });
			return;
		}
		res.status(200).json(categoryProduct);
	} catch (err) {
		res.status(500).json(err);
	}
});

// create a new category
router.post('/', async (req, res) => {
	try {
		const newCategory = await Category.create({
			category_name: req.body.category_name,
		});
		res.status(200).json(newCategory);
	} catch (err) {
		res.status(400).json(err);
	}
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
	try {
		const updateCategory = await Category.update(
			{
				category_name: req.body.category_name,
			},
			{
				where: {
					id: req.params.id,
				},
			}
		);
		res.status(200).json(updateCategory);
	} catch (err) {
		res.status(400).json(err);
	}
});

// delete a category by its `id` value
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
