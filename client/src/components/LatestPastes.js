import React, { useEffect, useState } from "react";
import { Delete, Edit } from "@material-ui/icons";
import moment from "moment";

import axios from "axios";

export default function NewPaste() {
  const [pastes, setPastes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/getall").then((res) => {
      setPastes(res.data);
    });
  }, []);
const handleDelete=(idx)=>{
  console.log(idx)
  axios.delete(`http://localhost:5000/delete/${idx}`).then((res) => {
    const newPastes = pastes.filter((paste) => { return paste._id !== idx })
    console.log(newPastes)
    setPastes(newPastes)
  })
  .catch(error => {
    console.log(error.response)
});

}

const handleEdit=()=>{

}
  return (
    <div>
      <h3>Latest Pastes</h3>
      {pastes.length ? (
        <ul className="collection">
          {pastes.map((paste, idx) => {
            let pasteLink = "http://localhost:3000/paste/" + paste.idx;

            return (
              <li className="collection-item" key={idx}>
                {paste.title} on {moment(paste.createdAt).format("lll")}{" "}
                <a href={pasteLink}>Goto Paste</a>
                
              <Edit onClick={()=>handleEdit(paste._id)} />
              <Delete onClick={()=>handleDelete(paste._id)} />
            
              </li>
            );
          })}
        </ul>
      ) : (
        <h5>No Pastes Exists</h5>
      )}
    </div>
  );
}
