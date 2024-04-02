"use client";
import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [decryptedData, setDecryptedData] = useState(undefined);
  const [all, setAll] = useState([]);

  const router = useRouter();

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.min.js");

    const fetcher = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API}/api/allPdfs`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("ddd", data);
          setAll([...data]);
        })
        .catch((error) =>
          console.error("Error fetching decrypted data:", error)
        );
    };
    fetcher();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please choose a valid PDF file");
    }
  };

  // const handleUpload = async () => {
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   // console.log("ff", file);
  //   await fetch(`${process.env.NEXT_PUBLIC_API}/api/upload-pdf`, {
  //     method: "POST",
  //     body: formData,
  //   })
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const pdfUrl = URL.createObjectURL(blob);
  //       setDecryptedData(pdfUrl);

  //       // const loadkit = async () => {
  //       // const PSPDFKit = await import("pspdfkit");
  //       // if (pdfUrl) {
  //       //   // PSPDFKit.unload("#pdf-container");
  //       //   const PSPDFKit = import("pspdfkit");
  //       //   PSPDFKit.load({
  //       //     container: "#pdf-container",
  //       //     document: pdfUrl,
  //       //     // Add your configuration options here
  //       //     // Example: disable downloading and printing
  //       //     toolbarItems: [
  //       //       "thumbnails",
  //       //       "outline",
  //       //       "search",
  //       //       "annotation-creation",
  //       //     ],
  //       //     disableDownload: true,
  //       //     disablePrinting: true,
  //       //   });
  //       // }
  //       // };
  //       // loadkit();
  //     })
  //     .catch((error) => console.error("Error fetching decrypted data:", error));
  // };

  return (
    <div className="container mt-5">
      <h1 className="d-flex justify-content-center align-items-center mb-5">
        PDF Maker
      </h1>
      <div
        className="d-flex justify-content-center align-items-center mb-5"
        style={{ marginLeft: "130px" }}
      >
        <input type="file" onChange={handleFileChange} />
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <button
          className="btn"
          style={{ backgroundColor: "green" }}
          // onClick={handleUpload}
        >
          Upload
        </button>
        {error && (
          <p style={{ color: "red", marginTop: "23px", marginLeft: "5px" }}>
            {error}
          </p>
        )}
      </div>
      <div>
        <h2>Decrypted Data:</h2>
        {/* {decryptedData && (
          <iframe
            src={decryptedData}
            title="Embedded Content"
            width="100%"
            height="400px"
            allowFullScreen
          />
        )} */}
      </div>
      {/* {all.length !== 0 &&
        all.map((d) => (
          <iframe
            src={d?.pdf?.data}
            title="Embedded Content"
            width="100%"
            height="400px"
            allowFullScreen
          />
        ))} */}
    </div>
  );
}
