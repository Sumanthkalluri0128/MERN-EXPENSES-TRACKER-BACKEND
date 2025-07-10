const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Category = require("../model/Category");
const Transaction = require("../model/Transaction");

//! User registration

const transactionController = {
  //!add
  create: asyncHandler(async (req, res) => {
    const { type, category, amount, date, description } = req.body;
    if (!amount || !type || !date) {
      throw new Error("Type,amount and date are required");
    }
    //!create
    const transaction = await Transaction.create({
      user: req.user,
      type,
      category,
      amount,
      description,
    });
    res.json(transaction);
  }),
  //!lists
  getFilteredTransactions: asyncHandler(async (req, res) => {
    const { startDate, endDate, type, category } = req.query;
    let filters = { user: req.user };
    if (startDate) {
      filters.date = { ...filters.date, $gte: new Date(startDate) };
    }
    if (endDate) {
      filters.date = { ...filters.date, $lte: new Date(endDate) };
    }
    if (type) {
      filters.type = type;
    }
    if (category) {
      if (category == "All") {
        //!no category filter required
      } else if (category == "Uncategorized") {
        //!filter transactions that are specifically categorized as uncategorized
        filters.category = "Uncategorized";
      } else {
        filters.category = category;
      }
    }
    const transactions = await Transaction.find(filters).sort({ date: -1 });
    res.json(transactions);
  }),
  //!update
  update: asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    if (transaction && transaction.user.toString() == req.user.toString()) {
      (transaction.type = req.body.type || transaction.type),
        (transaction.category = req.body.category || transaction.category),
        (transaction.amount = req.body.amount || transaction.amount),
        (transaction.date = req.body.date || transaction.date),
        (transaction.description =
          req.body.description || transaction.description);
      //update
      const updatedTransaction = await transaction.save();
      res.json(updatedTransaction);
    }
  }),
  //!delete
  delete: asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    if (transaction && transaction.user.toString() == req.user.toString()) {
      await Transaction.findByIdAndDelete(req.params.id);
      res.json({ message: "Transaction removed" });
    }
  }),
};
module.exports = transactionController;
