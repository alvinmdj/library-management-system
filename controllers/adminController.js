exports.admin_dashboard = (req, res) => {
  res.render('admin/index')
}

exports.books = (req, res) => {
  res.render('admin/books')
}

exports.add_book_view = (req, res) => {
  // const { title, author, publishYear } = req.body
  res.render('admin/book-add')
}

exports.add_book = (req, res) => {
  res.send('Add book')
}

exports.update_book_view = (req, res) => {
  res.send('update book view')
}

exports.update_book = (req, res) => {
  res.send('Update book')
}

exports.delete_book = (req, res) => {
  res.send('Delete book')
}

