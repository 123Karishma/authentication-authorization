const express = require('express')
const { handleNotes, getNotes, notesUpdatebyId, noteDelete, notesUpdatedGet, searchQuery, paginationNotes } = require("../controllers/notes")
const verifyAuth = require("../middleware/auth")

const router = express.Router()

router.post("/home", verifyAuth, handleNotes);
// router.get("/home", verifyAuth, getNotes);

router.post('/home/edit/:id', verifyAuth, notesUpdatebyId)
router.get('/home/edit/:id', verifyAuth, notesUpdatedGet)

router.post('/home/delete/:id', verifyAuth, noteDelete)

router.get("/search", verifyAuth, searchQuery)

router.get('/home', verifyAuth, paginationNotes)

module.exports = router