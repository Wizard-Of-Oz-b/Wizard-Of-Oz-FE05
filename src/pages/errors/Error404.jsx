import React from "react";
import ErrorPage from "../../components/common/layouts/errors/ErrorPage";

export default function Error404({ onSearch }) {
  return <ErrorPage status={404} />;
}