exports.register = (req, res, next) => {
  try {
    console.log(req.body);
    res.status(200).send('register')
  } catch (err) {
    next(err)
  }
}