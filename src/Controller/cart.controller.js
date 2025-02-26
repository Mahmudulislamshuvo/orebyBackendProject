const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");
const CartModel = require("../Model/cart.model");
const UserMolel = require("../Model/user.model");

const AddtoCart = async (req, res) => {
  try {
    const { product, size, color, quantity } = req.body;
    console.log(req.body);

    if (!product || !quantity) {
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
      isAlreadyInCart.quantity += 1;
      await isAlreadyInCart.save();
      return res
        .status(400)
        .json(
          new apiError(
            false,
            400,
            null,
            `This product is already in the cart Quantity +1`,
            true
          )
        );
    }

    // Save it to cart
    const SaveCart = await new CartModel({
      user: req.user.userId,
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
    const AllcartItem = await CartModel.find({ user: user.userId })
      .populate({ path: "product" })
      .populate({ path: "user", select: "-recoveryEmail -password -Otp" })
      .lean();

    if (!AllcartItem.length) {
      return res.status(404).json(new apiError(404, "CartItem not found"));
    }

    let totalItem = 0;
    let totalQuantity = 0;
    // AllcartItem.forEach((item) => {
    //   // Use forEach instead of map (no return value needed)
    //   const { product, quantity } = item;
    //   totalItem += product.price * quantity;
    //   totalQuantity += quantity;
    // });

    AllcartItem?.map((item) => {
      const { product, quantity } = item;
      totalItem += parseInt(product.price) * parseInt(quantity);
      totalQuantity += quantity;
    });

    return res.status(200).json(
      new apiResponse(
        true,
        {
          AllcartItem: AllcartItem,
          totalAmount: totalItem,
          totalQuantity: totalQuantity,
        },

        "Add to cart retrive Sucessfull",
        false
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(new apiError(500, `Error fetching cart items: ${error.message}`));
  }
};

const incrementCartitem = async (req, res) => {
  try {
    const { cartid } = req.params;
    const cartItem = await CartModel.findOne({ product: cartid });
    cartItem.quantity += 1;
    await cartItem.save();
    return res
      .status(201)
      .json(
        new apiResponse(true, cartItem, `Quantuty increse 1 succesfull`, false)
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          500,
          `Error from incrementCartitem controller: ${error.message}`
        )
      );
  }
};

const decrementCartitem = async (req, res) => {
  try {
    const { cartid } = req.params;
    // 1. Find the specific cart item
    const cartItem = await CartModel.findOne({ product: cartid });
    if (!cartItem) {
      return res
        .status(400)
        .json(new apiError(false, 400, null, `this CartItem not found`, true));
    }
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await cartItem.save();
      return res
        .status(201)
        .json(
          new apiResponse(
            true,
            cartItem,
            `Quantity decreased successfully`,
            false
          )
        );
    } else {
      // If quantity is 1, don't allow decrement
      return res
        .status(400)
        .json(
          new apiError(400, `Cannot decrease the quantity below 1`, null, true)
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(500, `Error from Decrement controller: ${error.message}`)
      );
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { cartid } = req.params;
    // 1. Find the specific cart item
    const cartItem = await CartModel.findByIdAndDelete(cartid);
    if (!cartItem) {
      return res
        .status(400)
        .json(new apiError(false, 400, null, `this CartItem not found`, true));
    }

    return res
      .status(201)
      .json(
        new apiResponse(true, cartItem, `Cart Item deleted succesfully`, false)
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          500,
          `Error from deleteCartItem controller: ${error.message}`
        )
      );
  }
};

const userCart = async (req, res) => {
  try {
    const user = req.user; //comes from Authguad
    const { userId } = user;
    const cartItems = await CartModel.find({
      user: userId,
    })
      .populate({ path: "user", select: "-Otp -recoveryEmail -password" })
      .populate("product");

    // reduce result, this is new for me
    const TotalpriceOfCart = cartItems.reduce(
      (initialValue, item) => {
        const { product, quantity } = item;
        initialValue.totalAmount += product.price * quantity;
        initialValue.totalQuantity += quantity;
        return initialValue;
      },
      { totalAmount: 0, totalQuantity: 0 }
    );
    return res.status(201).json(
      new apiResponse(
        true,
        {
          cartItems,
          totalAmount: TotalpriceOfCart.totalAmount,
          totalQuantity: TotalpriceOfCart.totalQuantity,
        },
        `Cart Item retrive succesfully`,
        false
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(500, `Error from userCart controller: ${error.message}`)
      );
  }
};

const removeCartItem = async (req, res) => {
  try {
    const user = req.user;
    const { cartid } = req.query;
    // 1. Find the specific cart item
    const cartItem =
      await CartModel.findByIdAndDelete(cartid).populate("product");
    if (!cartItem) {
      return res
        .status(400)
        .json(new apiError(false, 400, null, `this CartItem not found`, true));
    }
    // remove it from user DB hidely
    const removeFromUserDB = await UserMolel.findByIdAndUpdate(
      { _id: user.userId },
      { $pull: { cartitem: cartid } },
      { new: true }
    ).select("cartitem");

    return res
      .status(201)
      .json(
        new apiResponse(true, cartItem, `Cart Item deleted succesfully`, false)
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          500,
          `Error from removeCartItem controller: ${error.message}`
        )
      );
  }
};

module.exports = {
  AddtoCart,
  GetCartItemUser,
  decrementCartitem,
  incrementCartitem,
  deleteCartItem,
  userCart,
  removeCartItem,
};
