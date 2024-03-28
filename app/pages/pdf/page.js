"use client";
import { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { getAllFiles } from "@/app/api-calls/api";

function Pdf() {
  const [allFiles, setAllFiles] = useState([]);

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.min.js");

    const fetcher = async () => {
      const allData = await getAllFiles();
      setAllFiles([...allData]);
    };
    fetcher();
  }, []);

  const handleDownload = useCallback(async (fileName, fileData) => {
    if (typeof window !== "undefined") {
      const tempHtml2pdf = await import("html2pdf.js");
      const content = `
    <div>
      <h1>Dynamic Content</h1>
      <p>Data from Textarea: ${fileData}</p>
    </div>
  `;

      const options = {
        margin: 1,
        filename: `${fileName}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        onbeforestart: function () {
          document
            .querySelectorAll("input, textarea, select")
            .forEach((element) => {
              element.setAttribute("readonly", true);
            });
        },
      };
      const html2pdf = tempHtml2pdf.default;
      html2pdf()
        .from(content)
        .set(options)
        .toPdf()
        .get("pdf")
        .then((pdf) => {
          var totalPages = pdf.internal.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            const imgWidth = 2;
            const imgHeight = 2;
            const xPos = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
            const yPos = (pdf.internal.pageSize.getHeight() - imgHeight) / 2;
            pdf.addImage(
              "https://media.licdn.com/dms/image/C4D0BAQGFsqtalZltQg/company-logo_200_200/0/1668596426707/kyptronixllp_logo?e=1719446400&v=beta&t=2Rx_m3sPDoqBC_g8LT1MngALALVUihsQh2wIYWZlSDs",
              "png",
              xPos,
              yPos,
              imgWidth,
              imgHeight,
              "",
              "FAST",
              0.3
            );
          }
        })
        .save();
    }
  }, []);

  return (
    <>
      <h1 className="mb-5">All Pdfs</h1>
      {allFiles.length !== 0 &&
        allFiles.map((data) => (
          <div className="container">
            <table className="table">
              <thead>
                <tr>
                  <th>PDF Name</th>
                  <th>Restrictions</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data?.file_name}</td>
                  <td></td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        handleDownload(data?.file_name, data?.file_data);
                      }}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
    </>
  );
}

export default Pdf;
