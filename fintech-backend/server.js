const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000; // Choose a port different from your React app (usually 3000)

// --- Configuration ---

// Enable CORS for frontend communication
app.use(cors({
    origin: 'http://localhost:3000' // Replace with your React app's URL if different
}));

// Parse application/json
app.use(bodyParser.json());

// --- 1. MOCK DATABASE (MongoDB Simulation) ---
// In a real app, this data would come from a MongoDB connection
const mockUsersDB = [
    { id: 'user_001', name: 'Admin User', email: 'admin@rakshakx.com', balance: 500000, role: 'admin' },
];

// --- 2. MOCK BLOCKCHAIN LOGS (Ethereum/Hyperledger Simulation) ---
const blockchainLog = [];

// Helper function to simulate a secure hash (for transaction logging)
const generateMockHash = (data) => {
    return '0x' + (Math.random() * 0xFFFFFFFFFFFFFF).toString(16).padEnd(64, '0').slice(0, 64);
};

// --- 3. MOCK FINTECH API DATA ---
const MOCK_STOCK_PRICES = {
    'AAPL': 175.50, 'GOOGL': 1400.25, 'TSLA': 210.80, 'INFY': 15.60, 'HDFC': 1800.00, 'TCS': 3500.00
};

// --- ENDPOINTS ---

// 1. Transaction Logging (Blockchain/Web3.js Simulation)
// POST /api/transaction/log
app.post('/api/transaction/log', (req, res) => {
    const { txId, amount, userId, status, fingerprint } = req.body;
    
    // 🔐 SECURITY: Simulate Encryption before hashing
    const encryptedData = `AES-256(${txId}:${amount}:${status})`;

    const blockHash = generateMockHash(encryptedData);
    const timestamp = new Date().toISOString();

    const logEntry = {
        txId,
        userId,
        status,
        blockHash,
        timestamp,
        fingerprint,
        // Mock Smart Contract confirmation time
        contractConfirmed: '3 seconds', 
    };

    blockchainLog.push(logEntry);
    console.log(`[BLOCKCHAIN MOCK] New Transaction Logged: ${txId}`);

    res.status(200).json({ 
        message: 'Transaction logged securely via mock Web3/Smart Contract.', 
        blockHash: blockHash 
    });
});

// 2. Fetch User Data (MongoDB Simulation)
// GET /api/user/:id
app.get('/api/user/:id', (req, res) => {
    const userId = req.params.id;
    const user = mockUsersDB.find(u => u.id === userId);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'User not found in MongoDB.' });
    }
});

// 3. Mock Stock API (FinTech API Simulation)
// GET /api/stocks
app.get('/api/stocks', (req, res) => {
    const symbols = req.query.symbols ? req.query.symbols.split(',') : Object.keys(MOCK_STOCK_PRICES);
    const prices = {};

    symbols.forEach(symbol => {
        let basePrice = MOCK_STOCK_PRICES[symbol] || 100;
        // Simulate real-time fluctuation
        const fluctuation = (Math.random() - 0.5) * 5; 
        prices[symbol] = (basePrice + fluctuation).toFixed(2);
    });

    res.status(200).json(prices);
});

// 4. Mock Payment API (Razorpay Simulation)
// POST /api/payment/razorpay
app.post('/api/payment/razorpay', (req, res) => {
    const { amount, userId } = req.body;
    const txId = `RAZORPAY_TX_${Date.now()}`;
    
    // Implement simple fraud check (to show risk)
    if (amount > 100000) {
        // Simulate Fraud Block for high amount
        return res.status(400).json({ success: false, txId, message: 'Payment blocked by gateway fraud filters.' });
    }

    // Simulate success
    res.status(200).json({ 
        success: true, 
        txId, 
        message: 'Payment processed successfully.', 
        amount, 
        userId 
    });
});

// 5. Fetch Blockchain Logs
// GET /api/blockchain/logs
app.get('/api/blockchain/logs', (req, res) => {
    res.status(200).json(blockchainLog);
});


// Start Server
app.listen(port, () => {
    console.log(`FinTech Mock Backend listening at http://localhost:${port}`);
    console.log(`React app should connect to port ${port}`);
});

