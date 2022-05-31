var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Cart = require('../models/Cart');
var User = require('../models/User');
var Book = require('../models/Books');
var Comment = require('../models/Comment');
var auth = require('../middleware/auth');

//list all the books
router.get('/', async (req, res) => {
  try {
    let books = await Book.find({}).populate('category');
    res.status(202).json(books);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create book
router.post('/', async (req, res) => {
  try {
    let categoryname = req.body.category;
    req.body.category = [];
    let tagsArr = req.tags.split(',');
    req.body.tags = tagsArr;
    let book = await Book.create(req.body);
    // creat category with bookId
    let category = await Category.create({
      name: categoryname,
      bookId: book._id,
    });
    // update book
    let updateBook = await Book.findByIdAndUpdate(
      book._id,
      {
        $push: { category: category._id },
      },
      { new: true }
    );
    res.status(202).json({ updateBook });
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete Book
router.get('/delete/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let book = await Book.findByIdAndDelete(id);
    res.status(202).json(book);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Book
router.put('/:id', async (req, res) => {
  try {
    let categoryname = req.body.category;
    req.body.category = [];
    let id = req.params.id;
    let book = await Book.findByIdAndUpdate(id, req.body, { new: true });
    let updateCategory = await Category.findByIdAndUpdate(
      { bookId: book._id },
      { name: categoryname },
      { new: true }
    );
    let updateBook = await Book.findByIdAndUpdate(
      book._id,
      {
        $push: { category: updateCategory._id },
      },
      { new: true }
    );
    res.status(202).json(updateBook);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete category by name
router.get('/delete/:categoryname/category', async (req, res) => {
  try {
    let categoryname = req.params.categoryname;
    let category = await Category.deleteMany(
      { name: categoryname },
      { new: true }
    );
    res.status(202).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

// book having same category
router.get('/:categoryname/category', async (req, res) => {
  try {
    let categoryname = req.params.categoryname;
    let categoryData = await (
      await Category.find({ name: categoryname })
    ).populate('bookId');
    res.status(202).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// list all tags
router.get('/alltags', async (req, res) => {
  try {
    let books = await Book.find({}).populate('category');
    let tagarr = [];
    let tagsArray = books.forEach((b) => {
      b.tags.forEach((t) => {
        tagarr.push(t);
      });
    });
    let uniqueArr = [...new set(tagarr)];
    res.status(200).json(uniqueArr);
  } catch (err) {
    res.status(500).json(err);
  }
});

// user cart
router.get('/:id/addcart', async (req, res) => {
  try {
    req.userid = '6270bbe196cd34766c482eb4';
    let id = req.params.id;
    let createCart = await Cart.create({ user: req.userid, bookId: id });
    let cartBooks = await Cart.find({ user: req.userid }).populate('bookId');
    res.status(200).json(cartBooks);
  } catch (err) {
    console.log(req.userid);
    res.json({ err: 'error in user cart' });
  }
});

// remove book from cart
router.get('/:id/deletecart', async (req, rea) => {
  try {
    let id = req.params.id;
    let createCart = await Cart.findByIdAndDelete(id);
    let cartBooks = await Cart.find({ user: req.userid }).populate('bookId');
    res.status(200).json(cartBooks);
  } catch (err) {
    console.log(req.userid);
    res.json({ error: 'error during delete' });
  }
});

// create comment
router.post('/:bookId/comment', async (req, res) => {
  try {
    req.body.userId = req.userid;
    req.body.bookId = req.params.bookId;
    let comment = await Comment.create(req.body);
    let updateBook = await Book.findByIdAndUpdate(
      req.params.bookId,
      { $push: { comments: comment._id } },
      { new: true }
    );
    res.status(201).json({ message: 'comment created sucessfully' });
  } catch (err) {
    res.json({ error: 'comment is not created sucessfully' });
  }
});

module.exports = router;
