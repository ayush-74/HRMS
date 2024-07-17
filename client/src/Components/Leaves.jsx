import axios from "axios";
import React, { useEffect, useState } from "react";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/get_leaves")
      .then((result) => {
        let filter = result.data.leaves.filter(l => l.accepted!=true && l.accepted!=false);
        setLeaves(filter);
      })
      .catch((err) => console.log(err));
  }, [leaves]);
  console.log(leaves);

  function handleAccept(leaveId){
    axios.put("http://localhost:3000/auth/accept_leave",{leaveId});
  }

  function handleReject(leaveId){
    axios.put("http://localhost:3000/auth/reject_leave",{leaveId});
  }

  return (
    <div>
      <div className="flex-column justify-center align-center font-bold">
      <h2 className="m-[30px] text-2xl">Leaves List</h2>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Reason</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              leaves.map((l) => {
              return <tr>
                <td>{l.empid.name}</td>
                <th>{l.reason}</th>
                <td><button
                    className="btn btn-success btn-sm"
                    onClick={() => handleAccept(l._id)}
                  >
                    Accept
                  </button></td>
                <td><button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleReject(l._id)}
                  >
                    Reject
                  </button></td>
              </tr>;
              })
            }
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default Leaves;
