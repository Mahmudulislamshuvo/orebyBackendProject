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
    // checking product already in a cart or not
    const PrductAlreadyInCart = await CartModel.findOne({ product });
    if (PrductAlreadyInCart) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, `Product already in cart`, true));
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
    // Search Which User is Added to cart
    const WhichUser = await UserMolel.findOne({ id: user });
    WhichUser.cartitem.push();
    await WhichUser.save();
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(501, null, `Error from AddToCart controller: ${error}`)
      );
  }
};

module.exports = { AddtoCart };
