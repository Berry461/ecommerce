import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Set view engine and views directory
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'public'));

// Stripe Checkout Route
app.post('/stripe-checkout', async (req, res) => {
    try {
        const lineItems = req.body.items.map(item => {
            const unitAmount = Math.round(parseFloat(item.price) * 100);
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.title,
                        images: [item.productImgSrc]
                    },
                    unit_amount: unitAmount
                },
                quantity: item.quantity
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.DOMAIN || 'http://localhost:3000'}/success`,
            cancel_url: `${process.env.DOMAIN || 'http://localhost:3000'}/cancel`,
            line_items: lineItems,
            billing_address_collection: 'required'
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Success Route
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// Cancel Route
app.get('/cancel', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cancel.html'));
});

app.listen(3000, () => console.log('Server running on port 3000'));