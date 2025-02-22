// components/ErrorMessage.tsx
import React from "react";

interface ErrorMessageProps {
  errorMessage: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errorMessage }) => {
  return <p className="alert-message">{errorMessage}</p>;
};

export default ErrorMessage;
