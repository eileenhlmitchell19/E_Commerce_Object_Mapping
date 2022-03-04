const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

//-------------- GET PRODUCT ROUTE GET ALL PRODUCTS -----------//
// get all products
router.get("/", (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data

  Product.findAll({
    attributes: ["id", "product_name", "price", "stock", "category_id"],
    include: [
      {
        model: Category,
        attributes: ["id", "category_name"],
      },
      {
        model: Tag,
        attributes: ["id", "tag_name"],
      },
    ],
  })
  .then(dbProductData => res.json(dbProductData))
  .catch( err => {
    console.log(err);
    res.status(500).json(err)
  })
});


//--------------- GET PRODUCT ROUTE GET ONE PRODUCT -----------//
// get one product
router.get("/:id", async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productdata = await Product.findByPk(
      {
        where: {
          id: req.params.id,
        },
      },
      {
        include: [
          {
            model: Category,
            attributes: ["name"],
          },
          {
            model: Tag,
            attributes: ["name"],
          },
        ],
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

//--------------- POST PRODUCT ROUTE ------------//
router.post('/', async (req, res) => {
  try {// create a new category
  
  const newProd = await Product.create({
    id: req.body.id,
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id})
  res.status(200).json(newProd);
} catch (error) {
  res.status(507).json(error);
}
});


//--------------- UPDATE PRODUCT ROUTE ------------//

// update product
router.put("/:id", (req, res) => {
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
      // console.log(err);
      res.status(400).json(err);
    });
});

//--------------- DELETE PRODUCT ROUTE ------------//
router.delete("/:id", (req, res) => {
  // delete one product by its `id` value
  
    Product.destroy({
      where: {
        id: req.params.id,
      },
    }).then(dbProductData => {
      if (!dbProductData) {
        res.status(404).json({ message: "No product found with that id!" });
        return;
      }
      res.json(dbProductData)
    })
    .catch( err => {
      console.log(err);
      res.status(500).json(err)
    })
});

module.exports = router;
