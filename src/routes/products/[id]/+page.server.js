import { getDb } from '$lib/server/db';

export async function load({ params }) {
    const db = await getDb();

    const product = await db.collection('products').findOne({
        id: Number(params.id)
    });

    if (!product) {
        return {
            product: null
        };
    }

    return {
        product: {
            ...product,
            _id: product._id.toString()
        }
    };
}