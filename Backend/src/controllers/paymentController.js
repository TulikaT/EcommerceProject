// src/controllers/paymentController.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2020-08-27" });

export const createCheckoutSession = async (req, res) => {
  try {
    const { totalAmount } = req.body;

    // Validate totalAmount
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ error: "Invalid total amount" });
    }

    // Convert totalAmount to cents (Stripe requires amounts in cents)
    const amountInCents = Math.round(totalAmount * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Cart Purchase",
              description: "Total payment for selected items",
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/success`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
