import midtransClient from "midtrans-client";
import { v4 as uuidv4 } from "uuid";

export const GetTokenForPayment = async (req, res) => {
  try {
    const { products, customer_name, customer_email } = req.body;

    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.SECRET,
      clientKey: process.env.REACT_PUBLIC_CLIENT,
    });

    const calculateTotalAmount = (items) => {
      return items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    };

    const order_id = `${uuidv4()}`;
    const midtransItemDetails = products.map((product) => ({
      id: product.id,
      price: product.price,
      quantity: product.quantity,
      name: product.name,
    }));

    let parameter = {
      transaction_details: {
        order_id,
        gross_amount: calculateTotalAmount(midtransItemDetails),
      },
      item_details: midtransItemDetails,
      customer_details: {
        first_name: customer_name,
        email: customer_email,
      },
    };

    let transactionToken = await snap.createTransactionToken(parameter);
    console.log("transactionToken:", transactionToken);
    res.status(200).json({
      message: "generate token berhasil!!",
      token: transactionToken,
      customer_details: parameter,
    });
  } catch (error) {
    console.log("Error: ", error);
  }
};
