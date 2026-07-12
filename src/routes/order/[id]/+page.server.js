// src/routes/order/[id]/+page.server.js
import emailjs from '@emailjs/nodejs';
import { fail, error } from '@sveltejs/kit';
import { MongoClient } from 'mongodb';
import { 
    EMAILJS_PUBLIC_KEY, 
    EMAILJS_PRIVATE_KEY, 
    EMAILJS_SERVICE_ID, 
    EMAILJS_TEMPLATE_ID,
    MONGODB_URI 
} from '$env/static/private';

console.log("Mongo URI exists:", !!MONGODB_URI);

const client = new MongoClient(MONGODB_URI);
let dbConnection;

async function getDatabase() {
    try {
        if (!dbConnection) {
            console.log("Connecting to Mongo...");
            await client.connect();
            console.log("Connected!");
            dbConnection = client.db('mlclub'); 
        }
        return dbConnection;
    } catch (err) {
        console.error("FULL MONGO ERROR:", err);
        throw err;
    }
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    try {
        const db = await getDatabase();
        const productsCollection = db.collection('products');
        const idAsNumber = Number(params.id);
        
        const product = await productsCollection.findOne({
            $or: [
                { id: params.id },
                { id: isNaN(idAsNumber) ? null : idAsNumber }
            ]
        });

        if (!product) {
            throw error(404, {
                message: `Product with ID "${params.id}" could not be found.`
            });
        }

        return {
            product: {
                ...product,
                _id: product._id?.toString()
            }
        };
    } catch (err) {
        if (err.status) throw err;
        console.error('Failed to load product details:', err);
        throw error(500, { message: 'Failed to load product details from database.' });
    }
}

// Temporary in-memory store to keep track of generated OTP codes and order payloads
const otpStore = new Map();

/** @type {import('./$types').Actions} */
export const actions = {
    // Action 1: Triggers when the user requests an email verification code
    sendOtp: async ({ request }) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const fullName = formData.get('fullName');
        const quantity = formData.get('quantity');
        const size = formData.get('size');
        const address = formData.get('address');

        if (!email || typeof email !== 'string') {
            return fail(400, { message: 'A valid email address is required.' });
        }
        if (!size || !address) {
            return fail(400, { message: 'Size and Shipping Address are required items.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // FIX: Cache EVERY piece of order data safely out-of-reach from client modifications
        otpStore.set(email, {
            otp,
            fullName: fullName || 'Guest Customer',
            quantity: quantity ? Number(quantity) : 1,
            size: size.toString(),
            address: address.toString(),
            expiresAt: Date.now() + 5 * 60 * 1000
        });

        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    to_email: email,
                    to_name: fullName || 'there',
                    otp_code: otp
                },
                {
                    publicKey: EMAILJS_PUBLIC_KEY,
                    privateKey: EMAILJS_PRIVATE_KEY,
                }
            );

            return { 
                otpSent: true, 
                email: email 
            };
        } catch (err) {
            console.error('EmailJS delivery failure:', err);
            return fail(500, { message: 'Failed to deliver security code. Try again.' });
        }
    },

    // Action 2: Triggers when the user inputs their code and presses finalize
    verifyAndOrder: async ({ params, request }) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const submittedOtp = formData.get('otp');

        // Look up the master cached record from step 1
        const record = otpStore.get(email);

        if (!record) {
            return fail(400, { message: 'No verification record found for this email address. Please start over.' });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(email); 
            return fail(400, { message: 'Verification code expired. Please request a new one.' });
        }

        if (record.otp !== submittedOtp) {
            return fail(400, { message: 'Invalid code. Please double check and try again.' });
        }

        // Clean up the cache token immediately upon verification success
        otpStore.delete(email);

        const simulatedOrderId = 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();

        try {
            const db = await getDatabase();
            const ordersCollection = db.collection('orders');

            // FIX: Pull directly from our pristine server record cache rather than risky hidden inputs
            const orderDocument = {
                orderId: simulatedOrderId,
                routeParamId: params.id,
                customerName: record.fullName,
                customerEmail: email,
                shippingAddress: record.address,
                clothingSize: record.size,
                quantity: record.quantity,
                status: 'Confirmed',
                createdAt: new Date()
            };

            await ordersCollection.insertOne(orderDocument);

            return {
                orderPlaced: true,
                orderId: simulatedOrderId
            };
        } catch (dbErr) {
            console.error('MongoDB database storage failure:', dbErr);
            return fail(500, { message: 'Order verified, but failed to save details to database.' });
        }
    }
};