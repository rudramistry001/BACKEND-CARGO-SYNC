import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' },  // 7 days TTL for refresh token
});

const Token = mongoose.model('Token', tokenSchema);

export default Token;
