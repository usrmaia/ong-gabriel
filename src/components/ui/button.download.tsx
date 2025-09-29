"use client";

type DownloadButtonProps = {
  data?: Uint8Array;
  filename?: string;
  label: string;
  mimeType?: string;
};

export const DownloadButton = ({
  data,
  filename,
  label,
  mimeType,
}: DownloadButtonProps) => {
  const handleDownload = () => {
    if (!data) return;

    const blob = new Blob([data as unknown as BlobPart], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "documento.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="text-blue-600 hover:text-blue-800 underline text-left disabled:text-gray-400 disabled:cursor-not-allowed"
      disabled={!data}
    >
      {label}
    </button>
  );
};
