const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
//-------------- GET CATEGORY ROUTE GET ALL CATEGORIES -----------//

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  
    Category.findAll({
      attributes: ["id", "category_name"],
      include: [
        { 
          model: Product, 
          attributes: ["id","product_name", "price", "stock", "category_id"] 
        }
      ],
    })
    .then(categoryData => res.json(categoryData))
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })

});


//--------------- GET CATEGORY ROUTE GET ONE CATEGORY -----------//
//

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

//--------------- POST CATEGORY ROUTE ------------//

router.post('/', async (req, res) => {
  try {// create a new category
  
  const newCat = await Category.create({category_name: req.body.category_name})
  res.status(200).json(newCat);
} catch (error) {
  res.status(507).json(error);
}
});

//--------------- UPDATE CATEGORY ROUTE ------------//

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

// router.delete('/:id', async (req, res) => {
//   // delete a category by its `id` value
//   try {
//     const categoryRoutes = await Category.destroy({
//       where: {
//         id: req.params.id,
//       },
//     });

//     if (!categoryRoutes) {
//       res.status(404).json({ message: 'No category routes found!' });
//       return;
//     }

//     res.status(200).json(categoryRoutes);
//   } catch (err) {
//     res.status(500).json(err);
//   }
//   res.json({ success:true, hit:"Delete category"})
// });

//--------------- DELETE CATEGORY ROUTE ------------//

router.delete("/:id", (req, res) => {
  // delete one product by its `id` value
  
    Product.destroy({
      where: {
        id: req.params.id,
      },
    }).then(dbCategoryData => {
      if (!dbCategoryData) {
        res.status(404).json({ message: "No product found with that id!" });
        return;
      }
      res.json(dbCategoryData)
    })
    .catch( err => {
      console.log(err);
      res.status(500).json(err)
    })
});
module.exports = router;
