const express=require("express")

const { register, login, AddSkillOfProvider, UpdateSkillOfProvider, addEducationProvider, updateEducationProvider, AddEducation, updateEducation, connections, updateworkrole, getUserDetails, allUserDetails, addLocation, addjobtitle, addjoboffer, logout, updatepassword, myprofile, createjob, deletejoboffer, findalljob, findjob } = require("../controller/Usercontroller")
const { isAuthenticated } = require("../utils/auth")
const router=express.Router()


//
 router.route("/addskills").post(isAuthenticated,AddSkillOfProvider)
 router.route("/updateskills").post(isAuthenticated,UpdateSkillOfProvider)
 router.route("/addeducation").post(isAuthenticated,AddEducation)
 router.route("/updateeducation").post(isAuthenticated,updateEducation)
 router.route("/follow/:id").get(isAuthenticated,connections)
 router.route("/updateworkrole").post(isAuthenticated,updateworkrole)
router.route("/updatepassword").post(isAuthenticated,updatepassword)
router.route("/myprofile").get(isAuthenticated,myprofile)
router.route("/login").post(login)
router.route("/logout").get(isAuthenticated,logout)
router.route("/register").post(register)
router.route("/getuserdetail").get(isAuthenticated,getUserDetails)
router.route("/alluserdetails").get(isAuthenticated,allUserDetails)
router.route("/getlocation").post(isAuthenticated,addLocation)
router.route("/addjobtitle").post(isAuthenticated,addjobtitle)
router.route("/createjoboffer").post(isAuthenticated,createjob)
router.route("/deletejoboffer/:id").delete(isAuthenticated,deletejoboffer)
router.route("/alljobs").get(isAuthenticated,findalljob)
router.route("/searchjob").get(isAuthenticated,findjob)

module.exports=router