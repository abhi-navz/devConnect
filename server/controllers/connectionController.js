import Connection from "../models/Connection.js";
import User from "../models/User.js";

// @desc    Send a connection request
// @route   POST /api/connections/request/:userId
// @access  Private
const sendRequest = async (req, res, next) => {
  try {
    const recipientId = req.params.userId;

    if (recipientId === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot connect with yourself");
    }

    const recipientExists = await User.findById(recipientId);
    if (!recipientExists) {
      res.status(404);
      throw new Error("User not found");
    }

    // Check both directions — maybe they already sent YOU a request
    const existing = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientId },
        { requester: recipientId, recipient: req.user._id },
      ],
    });

    if (existing) {
      res.status(400);
      throw new Error(
        existing.status === "accepted"
          ? "You are already connected"
          : "A connection request already exists between you two"
      );
    }

    const connection = await Connection.create({
      requester: req.user._id,
      recipient: recipientId,
    });

    res.status(201).json({ success: true, connection });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept a pending connection request
// @route   PUT /api/connections/accept/:connectionId
// @access  Private
const acceptRequest = async (req, res, next) => {
  try {
    const connection = await Connection.findById(req.params.connectionId);

    if (!connection) {
      res.status(404);
      throw new Error("Connection request not found");
    }

    // Only the recipient can accept — not the person who sent it
    if (connection.recipient.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to accept this request");
    }

    connection.status = "accepted";
    await connection.save();

    res.status(200).json({ success: true, connection });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a pending connection request
// @route   PUT /api/connections/reject/:connectionId
// @access  Private
const rejectRequest = async (req, res, next) => {
    try {
      const connection = await Connection.findById(req.params.connectionId);
  
      if (!connection) {
        res.status(404);
        throw new Error('Connection request not found');
      }
  
      if (connection.recipient.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to reject this request');
      }
  
      // Delete rather than mark 'rejected' — keeps the door open for a future request
      // instead of permanently blocking future connections between these two users.
      await connection.deleteOne();
  
      res.status(200).json({ success: true, message: 'Connection request rejected' });
    } catch (error) {
      next(error);
    }
  };

// @desc    Remove an existing connection (either side can do this)
// @route   DELETE /api/connections/:connectionId
// @access  Private
const removeConnection = async (req, res, next) => {
  try {
    const connection = await Connection.findById(req.params.connectionId);

    if (!connection) {
      res.status(404);
      throw new Error("Connection not found");
    }

    const isParticipant =
      connection.requester.toString() === req.user._id.toString() ||
      connection.recipient.toString() === req.user._id.toString();

    if (!isParticipant) {
      res.status(403);
      throw new Error("Not authorized to remove this connection");
    }

    await connection.deleteOne();

    res.status(200).json({ success: true, message: "Connection removed" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all accepted connections for the logged-in user
// @route   GET /api/connections
// @access  Private
const getMyConnections = async (req, res, next) => {
  try {
    const connections = await Connection.find({
      status: "accepted",
      $or: [{ requester: req.user._id }, { recipient: req.user._id }],
    })
      .populate("requester", "name username profilePicture skills")
      .populate("recipient", "name username profilePicture skills");

    // Flatten so frontend always gets "the other person", regardless of who requested
    const formatted = connections.map((conn) => {
      const isRequester =
        conn.requester._id.toString() === req.user._id.toString();
      return {
        connectionId: conn._id,
        user: isRequester ? conn.recipient : conn.requester,
        connectedSince: conn.updatedAt,
      };
    });

    res
      .status(200)
      .json({ success: true, count: formatted.length, connections: formatted });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending requests received by the logged-in user
// @route   GET /api/connections/pending
// @access  Private
const getPendingRequests = async (req, res, next) => {
  try {
    const requests = await Connection.find({
      recipient: req.user._id,
      status: "pending",
    }).populate("requester", "name username profilePicture skills");

    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Get connection status between logged-in user and another user
// @route   GET /api/connections/status/:userId
// @access  Private
const getConnectionStatus = async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;

    const connection = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: otherUserId },
        { requester: otherUserId, recipient: req.user._id },
      ],
    });

    if (!connection) {
      return res.status(200).json({ success: true, status: "not_connected" });
    }

    let status = connection.status;
    if (status === "pending") {
      status =
        connection.requester.toString() === req.user._id.toString()
          ? "pending_sent"
          : "pending_received";
    } else if (status === "accepted") {
      status = "connected";
    }

    res
      .status(200)
      .json({ success: true, status, connectionId: connection._id });
  } catch (error) {
    next(error);
  }
};

export {
  sendRequest,
  acceptRequest,
  rejectRequest,
  removeConnection,
  getMyConnections,
  getPendingRequests,
  getConnectionStatus,
};
