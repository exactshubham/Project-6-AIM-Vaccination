const express=require('express')
const router=express.Router()
const userController=require('../controllers/userController')
const userAuth=require('../middlewares/userAuthorization')

router.get('/test/userRoutes',userController.testUserController)
router.post('/user/create',userController.create)
router.post('/user/login',userController.login)
router.post('/user/booking',userAuth,userController.createBooking)
router.get('/user/view/availableVaccines',userAuth,userController.viewAvailableSlots)
router.post('/user/update/booking',userAuth,userController.updateTimeSlot)

module.exports=router