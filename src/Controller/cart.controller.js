const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");
const CartModel = require("../Model/cart.model");
const UserMolel = require("../Model/user.model");

const AddtoCart = async (req, res) => {
  try {
    const { user, product, size, color, quantity } = req.body;

    if (!user || !product || !quantity) {
      return res
        .status(404)
        .json(
          new apiError(
            false,
            404,
            null,
            `User Or Product Or Quantity Missing`,
            true
          )
        );
    }
    const WhichUser = await UserMolel.findById(req.user.userId).populate(
      "cartitem"
    );

    // check if the product is already in the cart
    const isAlreadyInCart = WhichUser.cartitem.find((cartId) => {
      return cartId.product.toString() === product.toString();
    });

    if (isAlreadyInCart) {
      return res
        .status(400)
        .json(
          new apiError(
            false,
            400,
            null,
            `This product is already in the cart`,
            true
          )
        );
    }

    // Save it to cart
    const SaveCart = await new CartModel({
      user,
      product,
      size,
      color,
      quantity,
    }).save();
    if (!SaveCart) {
      return res
        .status(404)
        .json(
          new apiError(false, 404, null, `unable to add product to cart`, true)
        );
    }

    // Search Which User is Added to cart

    WhichUser.cartitem.push(SaveCart._id);
    await WhichUser.save();

    if (!WhichUser) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, `user not found`, true));
    }
    // send response for cart model
    if (SaveCart) {
      return res
        .status(201)
        .json(
          new apiResponse(
            true,
            SaveCart,
            `Product Added To cart succusfully`,
            false
          )
        );
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(501, null, `Error from AddToCart controller: ${error}`)
      );
  }
};

const GetCartItemUser = async (req, res) => {
  try {
    const user = req.user;
    const AllcartItem = await CartModel.find({ user: user.userId });
    console.log(AllcartItem.length);
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          501,
          null,
          `Error from GetCartItemUser controller: ${error}`
        )
      );
  }
};

module.exports = { AddtoCart, GetCartItemUser };
