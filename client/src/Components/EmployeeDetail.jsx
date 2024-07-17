import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const EmployeeDetail = () => {
  const [employee, setEmployee] = useState([]);
  const { id } = useParams();
  const empid = id;
  const addLeaveUrl = `/add_leave/${id}`;
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/employee/detail/" + id)
      .then((result) => {
        setEmployee(result.data);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:3000/employee/get_my_leave/" + id)
      .then((result) => {
        setLeaves(result.data.leaves);
      })
      .catch((err) => console.log(err));
  }, [leaves]);
  const handleLogout = () => {
    axios
      .get("http://localhost:3000/employee/logout")
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };
  console.log(leaves);

  function checkStatus(val){
    if(val==true){
        return <span className="bg-green-200 p-[10px] rounded-xl">Accepted</span>;
    }
    else if(val==false){
        return <span className="bg-red-200 p-[10px] rounded-xl">Rejected</span>;
    }
    else{
        return "Not Enquired";
    }
  }

  return (
    <div>
      <div className="p-2 d-flex flex-row justify-content-center shadow">
        <h4>Human Resource Management System</h4>
      </div>
      <div className="flex flex-row-reverse">
        <div className="d-flex flex-column justify-content-center flex-column align-items-center w-[20vw] bg-gray-800 h-[100vh] text-white">
          <img src={employee.image} className="emp_det_image" />
          <div className="d-flex align-items-center flex-column mt-3">
            <h3>Name : {employee.name}</h3>
            <h3 className="p-[10px]">Email : {employee.email}</h3>
            <h3>Salary : ${employee.salary}</h3>
          </div>
          <div>
            <button className="btn btn-danger m-[20px]" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <div className="w-[80vw] p-[10px] text-white">
          <Link to={addLeaveUrl} class="btn btn-secondary">
            Add New Leave
          </Link>

          <div>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Reason</th>
                  <th scope="col">From</th>
                  <th scope="col">To</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((e) => {
                  return (
                    <tr>
                      <td>{e.reason}</td>
                      <td>{e.fromDate.slice(0,10)}</td>
                      <td>{e.toDate.slice(0,10)}</td>
                      <td>
                        {
                            checkStatus(e.accepted)
                        }
                      </td>
                      <td><button onClick={()=>{
                        const data = {empid,leaveId:e._id}
                        axios.delete('http://localhost:3000/employee/delete_leave',{data})
                        .then(res => {console.log(res)})
                        .catch(err => {console.log(err)});
                        window.location.reload();
                        console.log(data)
                      }} class="btn btn-warning">
                        Delete
                        </button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
