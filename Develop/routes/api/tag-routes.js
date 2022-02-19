const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagRoutes = await Tag.findAll({
      include: 
      [
        { 
          model: ProductTag, 
          attributes: ["producttag_name"] 
        },
        {
          model: Tag,
          attributes: ["tag_name"],
        },
      ],
    });
  res.status(200)
   // res.json({ success:true, hit:"Get product"})
  } catch (err) {
    res.status(500).json(err);
    res.json({ success:true, hit:"GET tag"})
  }
});
 
  
 


router.get('/:id', (req, res) => {
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
          attributes: ['name'],
        },
        {
          model: Tag,
          attributes: ['name'],
        },
      ],
    });
  } catch (err) {
      res.status(500).json(err);
    }
});


router.post('/', (req, res) => {
  // create a new tag
  // DONT TOUCH?
  res.json({ success:true, hit:"POST tag"})
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

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value

  try {
    const tagRoutes = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagRoutes) {
      res.status(404).json({ message: 'No tag routes found!' });
      return;
    }

    res.status(200).json(tagRoutes);
  } catch (err) {
    res.status(500).json(err);
  }
  res.json({ success:true, hit:"Delete product"})
});

module.exports = router;
