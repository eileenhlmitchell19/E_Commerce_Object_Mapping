const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryRoutes = await Category.findAll({
      attributes: ["id", "category_name"],
      include: [
        { 
          model: Product, 
          attributes: ["category_name"] 
        },
        {
          model: Tag,
          attributes: ["tag_name"],
        },
      ],
    });
    res.status(200).json(categoryRoutes);
  } catch (err) {
    res.status(500).json(err);
  }
});
  
// });



router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryRoutes = await Product.findByPk
    ({where:
      {
      id:req.params.id,
    }
  },
    {
      include: [
        {
          model: Category,
          attributes: ['category_name'],
        },
        {
          model: Tag,
          attributes: ['tag_name'],
        },
      ],
    });
  } catch (err) {
      res.status(500).json(err);
    }
});

router.post('/', (req, res) => {
  // create a new category
  //? to touch or not to touch
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value

    // update product data
    Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
      .then((product) => {
        // find all associated tags from ProductTag
        return Category.findAll({ where: { product_id: req.params.id } });
      })
      .then((categoryRoutes) => {
        // get list of current tag_ids
        const categoryTagIds = categoryRoutes.map(({ tag_id }) => tag_id);
        // create filtered list of new tag_ids
        const newCategoryTags = req.body.tagIds
          .filter((tag_id) => !categoryTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              category_id: req.params.id,
              tag_id,
            };
          });
        // figure out which ones to remove
        const categoryTagsToRemove = categoryTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
  
        // run both actions
        return Promise.all([
          CategoryTag.destroy({ where: { id: CategoryTagsToRemove } }),
          CategoryTag.bulkCreate(newCategoryTags),
        ]);
      })
      .then((updatedCategoryTags) => res.json(updatedCategoryTags))
      .catch((err) => {
        // console.log(err);
        res.status(400).json(err);
      });
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryRoutes = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!categoryRoutes) {
      res.status(404).json({ message: 'No category routes found!' });
      return;
    }

    res.status(200).json(categoryRoutes);
  } catch (err) {
    res.status(500).json(err);
  }
  res.json({ success:true, hit:"Delete category"})
});

module.exports = router;
