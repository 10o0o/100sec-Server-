var express = require('express')
var router = express.Router()
const controller = require('./controller')

router.get('/', controller.getBoard)
// router.get('/', controller.getBoards)
// router.post('/', controller.insertBoard)
// router.patch('/:boardId', controller.updateBoard)
// router.delete('/:boardId', controller.deleteBoard)
// router.get('/:boardId/comment', controller.getComments)
// router.post('/:boardId/comment', controller.insertComment)
// router.patch('/:boardId/comment/:commentId', controller.updateComment)
// router.delete('/:boardId/comment/:commentId', controller.deleteComment)

module.exports = router