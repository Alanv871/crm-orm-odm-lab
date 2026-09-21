const { mongoose } = require('../../config/mongoose');

const ACTIVITY_TYPES = ['CALL', 'EMAIL', 'MEETING'];

// contactId y userId son ids numericos del modelo relacional (PostgreSQL), por eso no usan ref.
const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ACTIVITY_TYPES
    },
    description: {
      type: String,
      required: true
    },
    contactId: {
      type: Number,
      required: true
    },
    userId: {
      type: Number,
      required: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    minimize: false,
    versionKey: false
  }
);

module.exports = mongoose.model('Activity', activitySchema);
