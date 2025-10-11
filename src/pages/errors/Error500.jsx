import React from "react";
import ErrorPage from "../../components/common/layouts/errors/ErrorPage";

export default function Error500() {
  return <ErrorPage status={500} />;
}
