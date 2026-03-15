import { useState, Fragment } from "react";
import { useRouteError, useNavigate } from "react-router";

export default function ErrorCode() {
  const error = useRouteError() as {
    status?: number;
    statusText?: string;
    message?: string;
    stack?: string;
  };
  const navigate = useNavigate();
  const [showStack, setShowStack] = useState(false);

  const statusCode = error?.status || 500;
  const message =
    error?.statusText ||
    error?.message ||
    "Terjadi kesalahan yang tidak terduga";
  const stack = error?.stack || null;

  return <Fragment></Fragment>;
}
