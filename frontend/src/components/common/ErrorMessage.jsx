function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
      <p className="text-red-800">{message || 'An error occurred. Please try again.'}</p>
    </div>
  );
}

export default ErrorMessage;