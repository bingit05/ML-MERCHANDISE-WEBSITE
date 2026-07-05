// src/routes/order/[id]/+page.server.js
import emailjs from '@emailjs/nodejs';
import { fail } from '@sveltejs/kit';
import { MongoClient } from 'mongodb';
import { 
    EMAILJS_PUBLIC_KEY, 
    EMAILJS_PRIVATE_KEY, 
    EMAILJS_SERVICE_ID, 
    EMAILJS_TEMPLATE_ID,
    MONGODB_URI 
} from '$env/static/private';


console.log("Mongo URI exists:", !!MONGODB_URI);
console.log("Mongo URI:", MONGODB_URI?.slice(0, 30));

// Initialize the MongoDB client once so it reuses connections efficiently
const client = new MongoClient(MONGODB_URI);
let dbConnection;

async function getDatabase() {
    try {
        if (!dbConnection) {
            console.log("Connecting to Mongo...");
            await client.connect();
            console.log("Connected!");
            dbConnection = client.db('checkout_db');
        }
        return dbConnection;
    } catch (err) {
        console.error("FULL MONGO ERROR:", err);
        throw err;
    }
}

// Temporary in-memory store to keep track of generated OTP codes
const otpStore = new Map();

/** @type {import('./$types').Actions} */
export const actions = {
    // Action 1: Triggers when the user requests an email verification code
    sendOtp: async ({ request }) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const fullName = formData.get('fullName');
        const quantity = formData.get('quantity');

        if (!email || typeof email !== 'string') {
            return fail(400, { message: 'A valid email address is required.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        otpStore.set(email, {
            otp,
            fullName: fullName || 'Guest Customer',
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
        const address = formData.get('address');
        const size = formData.get('size');
        const quantity = formData.get('quantity');
        const submittedOtp = formData.get('otp');

    
        const record = otpStore.get(email);

        if (!record) {
            return fail(400, { message: 'No verification record found for this email.' });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(email); 
            return fail(400, { message: 'Verification code expired. Please request a new one.' });
        }

        if (record.otp !== submittedOtp) {
            return fail(400, { message: 'Invalid code. Please double check and try again.' });
        }

        // Clean up OTP from memory
        otpStore.delete(email);

        // Success! Generate a random checkout ID number
        const simulatedOrderId = 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();

        try {
            // Connect to MongoDB
            const db = await getDatabase();
            const ordersCollection = db.collection('orders');

            // Save the data to MongoDB
            const orderDocument = {
                orderId: simulatedOrderId,
                routeParamId: params.id, // Captures the folder [id] from the current page route
                customerName: record.fullName,
                customerEmail: email,
                shippingAddress: address,
                clothingSize: size,
                quantity: quantity ? Number(quantity) : 1,
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