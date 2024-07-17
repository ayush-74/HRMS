import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import Admin from "../models/Admin.js";
import Category from "../models/Category.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

const router = express.Router();

router.post("/adminsignup", async(req, res) => {
    const {email, password} = req.body;
    let hashedPassword;
    hashedPassword = await bcrypt.hash(password, 10);
    const admin = {
        email,password:hashedPassword
    };
    const add = await Admin.create(admin);
    if(add){
        return res.json({Status: true})
    }
    else{
        return res.json({Status: false, Error: err})
    }
});

router.post("/adminlogin", async(req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.json({ loginStatus: false, Error:"wrong email or password" });
        }
        const admin = await Admin.findOne({email:email});
        console.log(admin)
        if(bcrypt.compare(password,admin.password)){
            const token = jwt.sign(
                { role: "admin", email: admin.email, id: admin._id },
                "jwt_secret_key",
                { expiresIn: "1d" }
            );
            res.cookie('token', token)
            return res.json({ loginStatus: true });
        }
    } catch (error) {
        return res.json({ loginStatus: false, Error:"wrong email or password" });
    }
});

router.get('/category', async(req, res) => {
    const result = await Category.find({});
    if(result){
        return res.json({Status: true, Result: result})
    }
    else{
        return res.json({Status: false, Error: "Query Error"})
    }
})

router.post('/add_category', async(req, res) => {
    try {
        const {category} = req.body;
        const add = await Category.create({name:category});
        console.log(add);
        return res.json({Status: true})
    } catch (error) {
        return res.json({Status: false, Error: "Query Error"+error})
    }
})

// image upload 
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'Public/Images')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
//     }
// })
// const upload = multer({
//     storage: storage
// })
// end imag eupload 

router.post('/add_employee', async(req, res) => {
    const {name, email, password, address, salary, category_id} = req.body;
    let hashedPassword;
    hashedPassword = await bcrypt.hash(password, 10);
    const employee = {
        name,email,password:hashedPassword,address,salary,category_id,image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`
    };
    const add = await Employee.create(employee);
    console.log(add);
    if(add){
        return res.json({Status: true})
    }
    else{
        return res.json({Status: false, Error: err})
    }
})

router.get('/employee', async(req, res) => {
    const result = await Employee.find();
    if(result){
        res.json({Status: true, Result: result})
    }
    else{
        return res.json({Status: false, Error: "Query Error"})
    }
})

router.get('/employee/:id', async(req, res) => {
    const {id} = req.params;
    const result = await Employee.findById({_id:id});
    console.log(result);
    if(result){
        res.json({Status: true, Result: result})
    }
    else{
        return res.json({Status: false, Error: "Query Error"})
    }
})

router.put('/edit_employee/:id', async(req, res) => {
    const {id} = req.params;
    const {name, email, salary, address, category_id} = req.body;
    console.log("hehe");
    const result = await Employee.findByIdAndUpdate({_id:id},{name,email,address,salary,category_id,image:`https://api.dicebear.com/5.x/initials/svg?seed=${name}`},{new:true});
    if(result){
        res.json({Status: true, Result: result})
    }
    else{
        return res.json({Status: false, Error: "Query Error"})
    }
})

router.delete('/delete_employee/:id', async(req, res) => {
    const {id} = req.params;
    const deleteLeave = await Leave.deleteMany({empid:id});
    const result = await Employee.findByIdAndDelete({_id:id});
    console.log(result);
    if(result){
        return res.json({Status: true, Result: result})
    }
    else{
        return res.json({Status: false, Error: "Query Error"})
    }
})

router.get('/admin_count', async(req, res) => {
    const result = await Admin.countDocuments({});
    if(result){
        return res.json({Status: true, Result: result})
    }
    else{
        return res.json({Status: false, Error: "Query Error"})
    }
})

router.get('/employee_count', async(req, res) => {
    const result = await Employee.countDocuments({});
    if(result){
        return res.json({Status: true, Result: result})
    }
    else{
        return res.json({Status: false, Error: "Query Error"})
    }
})

router.get('/salary_count', async(req, res) => {
    const result = await Employee.aggregate([
        {
          $group: {
            _id: null, // Group all documents together
            totalSalary: { $sum: '$salary' } // Sum the 'salary' field
          }
        }
    ]);
    console.log(result[0].totalSalary);
    if(result[0].totalSalary){
        res.json({Status: true, Result: result[0].totalSalary})
    }
    else{
        return res.json({Status: false, Error: "Query Error"})
    }
})

router.get('/admin_records', async(req, res) => {
    const result = await Admin.find({});
    if(result){
        res.json({Status: true, Result: result})
    }
    else{
        return res.json({Status: false, Error: "Query Error"})
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})

router.get('/get_leaves', async(req,res) => {
    try {
        const leaves = await Leave.find({}).populate("empid");
        return res.status(200).json({
            success:true,
            message:'Got all leaves',
            leaves
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'leaves not fetched',
        });
    }
})

router.put('/accept_leave', async(req,res) => {
    try {
        const {leaveId} = req.body;
        const response = await Leave.findByIdAndUpdate({_id:leaveId},{accepted:true});
        return res.status(200).json({
            success:true,
            message:'request accepted',
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'leave not accepted',
        });
    }
})

router.put('/reject_leave', async(req,res) => {
    try {
        const {leaveId} = req.body;
        const response = await Leave.findByIdAndUpdate({_id:leaveId},{accepted:false});
        return res.status(200).json({
            success:true,
            message:'request rejected',
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'leave not rejected',
        });
    }
})

export { router as adminRouter };