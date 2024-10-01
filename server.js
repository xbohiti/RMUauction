require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const bcrypt = require('bcrypt');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: String
});

const User = mongoose.model('User', userSchema, 'users');

// Define Auction Item Schema
const auctionItemSchema = new mongoose.Schema({
    itemId: String,
    name: String,
    blockcahin: String,
    description: String,
    donor: String,
    value: String,
    startingBid: Number,
    startTime: Date,
    endTime: Date,
    image: String,
    infoLink: String,
    isSpecial: Boolean
});

const AuctionItem = mongoose.model('AuctionItem', auctionItemSchema);

// Define Bid Schema
const bidSchema = new mongoose.Schema({
    itemId: String,
    bid: Number,
    username: String,
    timestamp: { type: Date, default: Date.now }
});

const StandardBid = mongoose.model('Bid', bidSchema, 'bids');
const SpecialBid = mongoose.model('SpecialBid', bidSchema, 'special_bids');

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('register', async (userData, callback) => {
        try {
            const { username, email, password, name } = userData;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, email, password: hashedPassword, name });
            await newUser.save();
            callback({ success: true });
        } catch (error) {
            console.error('Registration error:', error);
            callback({ success: false, message: 'Username or email already exists' });
        }
    });

    socket.on('login', async (userData, callback) => {
        try {
            const { username, password } = userData;
            const user = await User.findOne({ username });
            if (user && await bcrypt.compare(password, user.password)) {
                callback({ success: true });
            } else {
                callback({ success: false, message: 'Invalid username or password' });
            }
        } catch (error) {
            console.error('Login error:', error);
            callback({ success: false, message: 'Login failed' });
        }
    });

    socket.on('fetchItems', async () => {
        try {
            const standardItems = await AuctionItem.find({ isSpecial: false });
            const specialItems = await AuctionItem.find({ isSpecial: true });

            const standardHighestBids = await StandardBid.aggregate([
                { $group: { _id: "$itemId", bid: { $max: "$bid" }, username: { $last: "$username" } } }
            ]);
            const specialHighestBids = await SpecialBid.aggregate([
                { $group: { _id: "$itemId", bid: { $max: "$bid" }, username: { $last: "$username" } } }
            ]);

            socket.emit('items', { 
                standard: standardItems, 
                special: specialItems,
                standardHighestBids: standardHighestBids,
                specialHighestBids: specialHighestBids
            });
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    });

    socket.on('bid', async (data) => {
        const { itemId, bid, username, isSpecial } = data;
        try {
            const user = await User.findOne({ username });
            if (!user) {
                socket.emit('bidError', { message: 'User not authenticated' });
                return;
            }
    
            const BidModel = isSpecial ? SpecialBid : StandardBid;
            const newBid = new BidModel({ itemId, bid, username });
            
            await newBid.save();
            console.log(`Bid saved: ${isSpecial ? 'Special' : 'Standard'} - ItemID: ${itemId}, Bid: ${bid}, User: ${username}`);
            
            // Emit the bid update to all connected clients
            io.emit('bidUpdate', { itemId, bid, username, isSpecial });
        } catch (error) {
            console.error('Error saving bid:', error);
            socket.emit('bidError', { message: 'Failed to save bid' });
        }
    });

    socket.on('fetchAllBids', async () => {
      try {
        const standardBids = await StandardBid.aggregate([
          { $group: { _id: "$itemId", bid: { $max: "$bid" }, username: { $last: "$username" } } }
        ]);
        const specialBids = await SpecialBid.aggregate([
          { $group: { _id: "$itemId", bid: { $max: "$bid" }, username: { $last: "$username" } } }
        ]);
        socket.emit('allBids', { standard: standardBids, special: specialBids });
      } catch (error) {
        console.error('Error fetching all bids:', error);
      }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
