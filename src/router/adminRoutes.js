const express=require('express')
const router=express.Router()
const adminController=require('../controllers/adminController')
const adminAuth=require('../middlewares/adminAuthorization')

router.get('/test/adminRoutes',adminController.testAdminController)
router.get('/admin/allBookings',adminAuth,adminController.viewAllSlots)
router.get('/admin/allUsers',adminAuth,adminController.viewAllUsers)
router.post('/admin/login',adminController.login)

module.exports=router