interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 shadow-sm"
      role="alert"
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
