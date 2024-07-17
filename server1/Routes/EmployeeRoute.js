import express from 'express'
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import Employee from '../models/Employee.js';
import Leave from '../models/Leave.js';

const router = express.Router()

router.post("/employee_login", async(req, res) => {
    const {email, password} = req.body;
    const user = await Employee.findOne({email:email});
    if(bcrypt.compare(password,user.password)){
        const token = jwt.sign(
            { role: "employee", email: user.email, id: user._id },
            "jwt_secret_key",
            { expiresIn: "1d" }
        );
        res.cookie('token', token)
        return res.json({ loginStatus: true, id: user._id });
    }
    else{
        return res.json({ loginStatus: false, Error:"wrong email or password" });
    }
  });

  router.get('/detail/:id', async(req, res) => {
    const {id} = req.params;
    const result = await Employee.findById({_id:id});
    if(result){
        return res.json(result);
    }
    else{
        return res.json({Status: false});
    }
  })

  router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
  })

  router.post('/add_leave', async(req,res) => {
    try {
        const {empid, reason ,fromDate, toDate} = req.body;
        const leaveDetails = {
            empid, reason, fromDate, toDate
        };
        console.log(leaveDetails);
        const leave = (await Leave.create(leaveDetails));
        const addToUser = await Employee.updateOne({_id: empid},{ $push: { leaves: leave._id} });
        return res.status(200).json({
            success:true,
            message:'Leave Created Successfully',
            leave,
            addToUser
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'Leave Creation Failed',
        });
    }
  })

  router.delete('/delete_leave', async(req,res) => {
    try {
        const {empid, leaveId} = req.body;
        const leave = await Leave.findByIdAndDelete({_id:leaveId});
        const removeToUser = await Employee.updateOne({_id: empid},{ $pull: { leaves: leaveId} })
        return res.status(200).json({
            success:true,
            message:'Leave Deleted Successfully',
            leave,
            removeToUser
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'Leave Deletion Failed',
        });
    }
  })

  router.get('/get_my_leave/:id', async(req,res) => {
    try {
        const {id} = req.params;
        const leaves = await Leave.find({empid:id}).sort({createdAt: -1});
        return res.status(200).json({
            success:true,
            leaves
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
        });
    }
  })

  export {router as EmployeeRouter}