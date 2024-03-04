import React from "react";
import { Circles } from "react-loader-spinner";

export default function Loader() {
  return (
    <>
      <div
        className="d-flex vh-100 vw-100 justify-content-center align-items-center position-fixed top-0 start-0"
        style={{ backgroundColor: "#ffffff70", zIndex: "999" }}
      >
        <Circles
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    </>
  );
}
