import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/users/hello").then((response) => {
      console.log(response.data);
    });
  }, []);

  const onClickHandler = () => {
    axios.get("/api/users/logout").then((res) => {
      if (res.data.success) {
        navigate("/login");
      } else {
        alert("로그아웃 하는데 실패했습니다.");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h2>시작 페이지</h2>

      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  );
}
