import express, { request, response } from 'express'
const router = express.Router()
const {verifyAuth, verifyAdminUser} = require('../middlewares/auth')

// Import note model
import Note from '../models/note'

// Add a note
router.post('/notes', verifyAuth, async(request, response) => {
  const body = request.body
  body.userId = request.user._id
  try {
    const noteDB = await Note.create(body)
    response.status(200).json(noteDB)
  } catch (error) {
    return response.status(500).json({
      message: 'Whoops there is an error',
      error: error
    })
  }
})

// fetch a single note
router.get('/notes/:id', async(request, response) => {
  const _id = request.params.id
  try {
    const noteDB = await Note.findOne({_id})
    response.json(noteDB)
  } catch (error) {
    returnError(response, error, 400, "Whoops there is an error")
  }
})

// all notes
router.get('/notes', verifyAuth, async(request, response) => {

  const userId = request.user._id

  try {
    const noteDB = await Note.find({userId})
    response.json(noteDB)
  } catch (error) {
    returnError(response, error, 400, "Whoops there is an error")
  }

})

// delete a note 
router.delete('/notes/:id', async(request, response) => {
  const _id = request.params.id //the const cannot be id it must be _id as the value in mongo db
  try {
    const noteDB = await Note.findByIdAndDelete(_id)
    response.json(noteDB)
  } catch (error) {
    returnError(response, error, 400, "Error note cannot be deleted")
  }
})

// update a note 
router.put('/notes/:id', async(request, response) => {
  const _id = request.params.id
  const body = request.body
  try {
    if (body.name === '') {
      return response.status(400).json({ message: "Name is required" })
    }
    const noteDB = await Note.findByIdAndUpdate(_id, body, {new: true})
    response.json(noteDB)
  } catch (error) {
    returnError(response, error, 404, "Note not found")
  }
})

function returnError(response, error, statusCode, message) {
  return response.status(statusCode).json({
    message: message,
    error: error
  })
}

// Export express app config
module.exports = router;

// notes

// how to handle a different value than _id ?
// how to validate that fields does not repeat
// how to validate with logic not db that a certain field match the type required 
// how to validate another note does not repeat the same info 
// what is the correct way to add helpers to DRY