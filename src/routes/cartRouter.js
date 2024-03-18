import { Router } from "express";
import cartModel from "../models/cart.js";

const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
  try {
    const mensaje = await cartModel.create({ products: [] });
    res.status(201).send(mensaje);
  } catch (e) {
    res.status(500).send(`internal error when create cart: ${error}`);
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartModel
      .findOne({ _id: cartId })
      .populate("products.id_prod");
    res.status(200).send(cart);
  } catch (error) {
    res
      .status(500)
      .send(`internal error when reading products from cart: ${error}`);
  }
});


cartRouter.post("/:cid/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    let { quantity } = req.body;

    if (quantity === undefined) {
      quantity = 1;
    }

    const updatedCart = await cartModel.findOneAndUpdate(
      { _id: cartId, "products.id_prod": productId },
      { $inc: { "products.$.quantity": quantity } },
      { new: true }
    );

    if (!updatedCart) {
      const cart = await cartModel.findByIdAndUpdate(
        cartId,
        { $push: { products: { id_prod: productId, quantity: quantity } } },
        { new: true }
      );
      res.status(200).send(cart);
    } else {
      res.status(200).send(updatedCart);
    }
  } catch (error) {
    res
      .status(500)
      .send(`internal error when reading products from cart: ${error}`);
  }
});


cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const updatedCart = await cartModel.findOneAndUpdate(
      { _id: cartId },
      { $pull: { products: { id_prod: productId } } }, 
      { new: true } 
    );

    if (updatedCart) {
      res.status(200).send(updatedCart);
    } else {
      res.status(404).send("Cart not found");
    }
  } catch (error) {
    res
      .status(500)
      .send(`internal error when deleting product from cart: ${error}`);
  }
});


cartRouter.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const newProducts = req.body;
    const updatedCart = await cartModel.findOneAndUpdate(
      { _id: cartId },
      { $set: { products: newProducts } },
      { new: true }
    );
    if (!updatedCart) {
      return res.status(404).send("Cart not found");
    }

    res.status(200).send(updatedCart);
  } catch (error) {
    res
      .status(500)
      .send(`internal error when updating products from cart: ${error}`);
  }
});
//Aqui actualiza la cantidad de productos mediante un set pero no los suma
cartRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).send("Invalid quantity");
    }

    const updatedCart = await cartModel.findOneAndUpdate(
      { _id: cartId, "products.id_prod": productId },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).send("Cart or product not found");
    }

    res.status(200).send(updatedCart);
  } catch (error) {
    res.status(500).send(`Internal error : ${error}`);
  }
});
//deja solo un array vacio en el carrito []
cartRouter.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const updatedCart = await cartModel.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).send("Cart not found");
    }

    res.status(200).send(" removed!");
  } catch (error) {
    res.status(500).send(`Internal error : ${error}`);
  }
});

export default cartRouter;