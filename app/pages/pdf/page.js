"use client";
import { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { addUser, getAllFiles, updateUser } from "@/app/api-calls/api";

function Pdf() {
  const [allFiles, setAllFiles] = useState([]);
  const [accesibleBy, setAccesibleBy] = useState([]);
  const [userEmailWhichWillBeAdd, setUserEmailWhichWillBeAdd] = useState("");
  const [docId, setDocId] = useState("");

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
      <p>${fileData}</p>
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
            const opacity = 0.3;

            pdf.addImage(
              "https://media.licdn.com/dms/image/C4D0BAQGFsqtalZltQg/company-logo_200_200/0/1668596426707/kyptronixllp_logo?e=1719446400&v=beta&t=2Rx_m3sPDoqBC_g8LT1MngALALVUihsQh2wIYWZlSDs",
              "png",
              xPos,
              yPos,
              imgWidth,
              imgHeight,
              "",
              "FAST",
              opacity
            );
          }
        })
        .save();
    }
  }, []);

  const checkValidity = async () => {
    for (let i = 0; i < accesibleBy.length; i++) {
      if (accesibleBy[i]?.email === userEmailWhichWillBeAdd) {
        alert("email already taken");
        return false;
      }
    }

    return true;
  };

  const handleAddUser = async () => {
    let isValidUser = await checkValidity();

    if (isValidUser) {
      const dataToBeAdded = {
        email: userEmailWhichWillBeAdd,
        status: "Active",
      };

      const dataToBeSend = {
        doc_id: docId,
        email: userEmailWhichWillBeAdd,
        status: "Active",
      };

      const addedData = await addUser(dataToBeSend);
      if (addedData) {
        setAccesibleBy([...accesibleBy, dataToBeAdded]);
        setUserEmailWhichWillBeAdd("");
        alert("user added successfully");
      } else {
        alert("try again letter!!!");
      }
    }
  };

  const handleUpdateUser = async (index, userEmail, userCurrentStatus) => {
    const dataForUpdatation = {
      doc_id: docId,
      email: userEmail,
      status: userCurrentStatus == "Active" ? "Inactive" : "Active",
    };

    const updatedData = await updateUser(dataForUpdatation);
    if (updatedData) {
      const tempData = [...accesibleBy];
      tempData[index].status =
        userCurrentStatus == "Active" ? "Inactive" : "Active";
      setAccesibleBy([...tempData]);
      alert("user updated successfully");
    } else {
      alert("try again letter!!! updatation failed");
    }
  };

  const isEligibleForDownload = () => {
    return true;
  };

  return (
    <>
      {/* <img
        src="https://media.licdn.com/dms/image/C4D0BAQGFsqtalZltQg/company-logo_200_200/0/1668596426707/kyptronixllp_logo?e=1719446400&v=beta&t=2Rx_m3sPDoqBC_g8LT1MngALALVUihsQh2wIYWZlSDs"
        style={{ opacity: "0.3" }}
      /> */}

      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h1 className="text-center mb-5">All PDFs</h1>
            <div className="container">
              <table className="table  table-bordered text-center">
                <thead>
                  <tr>
                    <th>PDF Name</th>
                    <th>Restrictions</th>
                    <th>Action</th>
                  </tr>
                </thead>
                {allFiles.length !== 0 &&
                  allFiles.map((data) => (
                    <tbody>
                      <tr>
                        <td>{data?.file_name}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            onClick={() => {
                              setAccesibleBy(data?.accessible_by);
                              setDocId(data?._id);
                            }}
                          >
                            Permissions
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              if (isEligibleForDownload()) {
                                handleDownload(
                                  data?.file_name,
                                  data?.file_data
                                );
                              }
                            }}
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  ))}
              </table>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Activate and Inactivate Users
              </h5>
            </div>

            <div className="modal-body">
              <div className="container-fluid">
                <div className="text-center mb-4 col">
                  <input
                    placeholder="put new user email"
                    onChange={(e) => {
                      setUserEmailWhichWillBeAdd(e.target.value);
                    }}
                    value={userEmailWhichWillBeAdd}
                  />

                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      handleAddUser();
                    }}
                  >
                    Add User
                  </button>
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-8">
                    <table className="table table-bordered text-center">
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      {accesibleBy.map((acc, index) => (
                        <tbody>
                          <tr>
                            <td>{acc?.email}</td>
                            <td>{acc?.status}</td>
                            <td>
                              <button
                                style={{
                                  backgroundColor:
                                    acc?.status == "Active" ? "red" : "green",
                                }}
                                className="btn btn-sm rounded"
                                onClick={() => {
                                  handleUpdateUser(
                                    index,
                                    acc?.email,
                                    acc?.status
                                  );
                                }}
                              >
                                {acc?.status == "Active"
                                  ? "Inactivate"
                                  : "Activate"}
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn"
                style={{ backgroundColor: "#8B0000" }}
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Pdf;
