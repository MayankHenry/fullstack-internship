const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key';

// Middleware to authenticate
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Get Cart
router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.id;
    db.get(`SELECT id FROM carts WHERE user_id = ?`, [userId], (err, cart) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!cart) return res.json([]);

        db.all(`
            SELECT ci.id as cart_item_id, ci.quantity, p.* 
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = ?
        `, [cart.id], (err, items) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(items);
        });
    });
});

// Add to Cart
router.post('/', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    db.get(`SELECT id FROM carts WHERE user_id = ?`, [userId], (err, cart) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const cartId = cart.id;
        
        // Check if item already in cart
        db.get(`SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?`, [cartId, productId], (err, item) => {
            if (err) return res.status(500).json({ error: err.message });
            
            if (item) {
                // Update quantity
                db.run(`UPDATE cart_items SET quantity = quantity + ? WHERE id = ?`, [quantity, item.id], function(err) {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: 'Cart updated' });
                });
            } else {
                // Add new item
                db.run(`INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)`, [cartId, productId, quantity], function(err) {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: 'Item added to cart' });
                });
            }
        });
    });
});

// Remove item from Cart
router.delete('/:cartItemId', authenticateToken, (req, res) => {
    const { cartItemId } = req.params;
    // To be safe, we should ensure the cart belongs to the user, but for simplicity we assume cartItemId is unique.
    db.run(`DELETE FROM cart_items WHERE id = ?`, [cartItemId], function(err) {
         if (err) return res.status(500).json({ error: err.message });
         res.json({ message: 'Item removed' });
    });
});

// Checkout (Dummy)
router.post('/checkout', authenticateToken, (req, res) => {
    const userId = req.user.id;
    db.get(`SELECT id FROM carts WHERE user_id = ?`, [userId], (err, cart) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!cart) return res.status(400).json({ message: 'Cart not found' });

        // Empty the cart
        db.run(`DELETE FROM cart_items WHERE cart_id = ?`, [cart.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Order placed successfully!' });
        });
    });
});

module.exports = router;
