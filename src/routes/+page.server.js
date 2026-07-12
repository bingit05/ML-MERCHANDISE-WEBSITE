import { getDb } from '$lib/server/db';

export async function load() {
    const db = await getDb();

    const products = await db
        .collection('products')
        .find({})
        .toArray();

    return {
        products: products.map(product => ({
            ...product,
            _id: product._id.toString()
        }))
    };
}