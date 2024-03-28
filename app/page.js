"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { usePDF } from "react-to-pdf";
import Image from "next/image";
import logo from "./logo.png";
import { saveFile } from "./api-calls/api";
import { useRouter } from "next/navigation";

export default function Home() {
  const handleCreate = async () => {
    function generateRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    const minNumber = 1;
    const maxNumber = 100;
    const randomNumber = generateRandomNumber(minNumber, maxNumber);
    const fileName = `page-${randomNumber}`;
    const fileContent = document.getElementById("content-id").value;
    const data = {
      file_name: fileName,
      file_data: fileContent,
      accessible_by: [],
    };

    await saveFile(data);
  };

  const router = useRouter();

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.min.js");
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="d-flex justify-content-center align-items-center mb-5">
        PDF Maker
      </h1>
      <textarea id="content-id" className="form-control" rows="3"></textarea>
      <div className="d-flex justify-content-center align-items-center mt-5">
        <button
          className="btn"
          style={{ backgroundColor: "#32cd32" }}
          onClick={handleCreate}
        >
          Create PDF
        </button>
      </div>
      <div className="d-flex justify-content-center align-items-center mt-5">
        <a
          style={{
            color: "blue",
            cursor: "pointer",
          }}
          onClick={() => {
            router.push("/pages/pdf");
          }}
        >
          to see all pdfs click here
        </a>
      </div>
    </div>
  );
}
