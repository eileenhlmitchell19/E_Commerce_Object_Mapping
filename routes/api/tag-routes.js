const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// get all products
router.get("/", (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data

  Tag.findAll({
    attributes: ["id", "tag_name"],
    include: [
      {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    ],
  })
  .then(dbTagData => res.json(dbTagData))
  .catch( err => {
    console.log(err);
    res.status(500).json(err)
  })
});
 
  
 


router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagRoutes = await Tag.findByPk
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


// router.post('/', (req, res) => {
//   // create a new tag
//   // DONT TOUCH?
//   res.json({ success:true, hit:"POST tag"})
// });

router.post('/', async (req, res) => {
  try {// create a new tag
  
  const newTag = await Tag.create({
    id: req.body.id,
    tag_name: req.body.tag_name,
})
  res.status(200).json(newTag);
} catch (error) {
  res.status(507).json(error);
}
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return Tag.findAll({ where: { product_id: req.params.id } });
    })
    .then((tagRoutes) => {
      // get list of current tag_ids
      const tagRoutesIds = tagRoutes.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newTagRoutes = req.body.tagIds
        .filter((tag_id) => !tagRoutesIds.includes(tag_id))
        .map((tag_id) => {
          return {
            tag_id: req.params.id,
            productTag_id,
          };
        });
      // figure out which ones to remove
      const tagRoutesToRemove = tagRoutes
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
       Tag.destroy({ where: { id: productTagsToRemove } }),
        Tag.bulkCreate(newTagRoutes),
      ]);
    })
    .then((updatedTagRoutes) => res.json(updatedTagRoutes))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// router.delete('/:id', async (req, res) => {
//   // delete on tag by its `id` value

//   try {
//     const tagRoutes = await Product.destroy({
//       where: {
//         id: req.params.id,
//       },
//     });

//     if (!tagRoutes) {
//       res.status(404).json({ message: 'No tag routes found!' });
//       return;
//     }

//     res.status(200).json(tagRoutes);
//   } catch (err) {
//     res.status(500).json(err);
//   }
//   res.json({ success:true, hit:"Delete product"})
// });

router.delete("/:id", (req, res) => {
  // delete one product by its `id` value
  
    Product.destroy({
      where: {
        id: req.params.id,
      },
    }).then(dbTagData => {
      if (!dbTagData) {
        res.status(404).json({ message: "No product found with that id!" });
        return;
      }
      res.json(dbTagData)
    })
    .catch( err => {
      console.log(err);
      res.status(500).json(err)
    })
});
module.exports = router;
