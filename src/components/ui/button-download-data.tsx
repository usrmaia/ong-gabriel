"use client";

type DownloadButtonProps = {
  data?: Uint8Array;
  filename?: string;
  mimeType?: string;
  children?: React.ReactNode;
};

export const ButtonDownloadData = ({
  data,
  filename,
  mimeType,
  children,
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
    <button onClick={handleDownload} className="cursor-pointer">
      {children}
    </button>
  );
};
