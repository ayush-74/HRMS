import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddLeave = () => {
    const {id} = useParams();
    const [data, setData] = useState({
        empid:id,
        reason:'',
        fromDate:'',
        toDate:''
    });
    const navigate = useNavigate();

    function handleSubmit(e){
        e.preventDefault();
        console.log(data);
        axios.post("http://localhost:3000/employee/add_leave",data)
        .then(res => {console.log(res)})
        .catch(err => {console.log(err)});
        navigate(-1);
    }

  return (
    <div >
      <form onSubmit={handleSubmit} className="flex border-4 border-sky-900 p-[50px] mt-[100px] rounded-2xl flex-column items-center justify-center w-[80vw] mx-[auto] h-full">
      <div className="flex itms-center justify-center my-[20px]">
        <label>
          Reason:
          <textarea
            className="border-3 border-sky-800 rounded-xl"
            onChange={(e) => setData({...data, reason : e.target.value})}
            rows="4"
            cols="50"
            required
          />
        </label>
      </div>
      <div className="flex itms-center justify-center my-[20px]">
        <label>
          From:
          <input
            className="border-1 border-sky-800 rounded-s px-[10px]"
            type="date"
            onChange={(e) => setData({...data, fromDate : e.target.value})}
            required
          />
        </label>
      </div>
      <div className="flex itms-center justify-center my-[20px]">
        <label>
          To:
          <input
            className="border-1 border-sky-800 rounded-s px-[10px]"
            type="date"
            onChange={(e) => setData({...data, toDate : e.target.value})}
            required
          />
        </label>
      </div>
      <button type="submit" className="mt-[10px] rounded-2xl bg-green-700 px-[20px] py-[10px] text-white">Submit</button>
    </form>
    </div>
  );
};

export default AddLeave;
