import React from "react";
import ErrorPage from "../../components/common/layouts/errors/ErrorPage";

export default function Error403() {
  return <ErrorPage status={403} />;
}