import React, { useEffect, useState } from "react";

import moment from "moment";

import axios from "axios";

import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript.js";

export default function ShowPaste(props) {
  const [paste, setPaste] = useState({
    idx: "",
    paste: "",
    title: "",
    expireAt: Date.now(),
    createdAt: Date.now(),
  });

  let idx = props.match.params.idx;

  useEffect(() => {
    axios.get(`http://localhost:5000/get/${idx}`).then((res) => {
      setPaste(res.data);
    });
  }, []);

  return (
    <div>
      {paste ? (
        <div>
          <h3>{paste.title}</h3>
          <CodeMirror
            value={paste.paste}
            options={{
              mode: "javascript",
              theme: "material",
              lineNumbers: true,
              readOnly: true,
            }}
          />
          <h4>RAW Format</h4>
          <textarea
            style={{ height: "250px" }}
            defaultValue={paste.paste}
            readOnly
          ></textarea>
          <div className="row">
            <h4>Paste Information</h4>
            <div className="col s12 date">
              <i
                className="material-icons prefix"
                style={{ margin: "5px 2px" }}
              >
                date_range
              </i>
              <span className="paste-info">
                <b>Posted on: </b>
                {moment(paste.createdAt).format("lll")}
              </span>
            </div>
            <div className="col s12 date">
              <i
                className="material-icons prefix"
                style={{ margin: "5px 2px" }}
              >
                access_time
              </i>
              <span className="paste-info">
                <b>Expires: </b>
                {paste.expireAt
                  ? moment(paste.expireAt).format("lll")
                  : "Never"}
              </span>
            </div>
          </div>
          <h4>Share this Paste</h4>
          <div className="row">
            <div className="col s8">
              <input
                id="share"
                value={`http://localhost:3000/paste/${paste.idx}`}
                readOnly
              ></input>
            </div>
            <div className="col s4">
              <button
                className="btn"
                onClick={() => {
                  let copyText = document.querySelector("#share");
                  copyText.select();
                  document.execCommand("copy");
                }}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      ) : (
        <h4>The paste does not exist or has expired</h4>
      )}
    </div>
  );
}
