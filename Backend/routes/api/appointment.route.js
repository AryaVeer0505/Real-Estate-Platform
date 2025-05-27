const router = require("express").Router();
const {checkAuth} = require("../../middlewares/checkAuth.js");
const newAppointment=require("../../controller/Appointment/newAppointment.js")
const updateAppointment=require("../../controller/Appointment/updateAppointment.js")
const deleteAppointment=require("../../controller/Appointment/deleteAppointment.js")
const myBooking=require("../../controller/Appointment/myBooking.js")
const checkBooking=require("../../controller/Appointment/checkBooking.js")
const ownerAppointments=require("../../controller/Appointment/ownerAppointments.js")
const allAppointments=require("../../controller/Appointment/allAppointments.js")
router.post('/newAppointment',checkAuth,newAppointment)
router.get('/myBookings/',checkAuth,myBooking)
router.put('/update/:id',checkAuth,updateAppointment)
router.delete('/delete/:id',checkAuth,deleteAppointment)
router.get('/checkBooking/:id',checkAuth,checkBooking)
router.get('/ownerAppointments',checkAuth,ownerAppointments)
router.get('/allAppointments',checkAuth,allAppointments)
module.exports = router;