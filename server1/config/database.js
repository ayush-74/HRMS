
import mongoose from "mongoose";

// require("dotenv").config();

const connect = () => {
    mongoose.connect("mongodb://localhost:27017/HRMS", {})
    .then(() => {console.log("DB connected successfully")})
    .catch( (err) => {
        console.log("DB CONNECTION ISSUES");
        console.error(err);
        process.exit(1);
    } );
}

export default connect;