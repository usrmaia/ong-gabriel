"use client";

type DownloadButtonProps = {
  documentId?: string;
  children?: React.ReactNode;
};

export const ButtonDownloadDocument = ({
  documentId,
  children,
}: DownloadButtonProps) => {
  const handleDownload = () => {
    if (!documentId) return;

    fetch(`/api/document/${documentId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch document");

        let filename = "document";
        const contentDisposition = response.headers.get("Content-Disposition");
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
          );
          if (filenameMatch && filenameMatch[1]) {
            filename = decodeURIComponent(
              filenameMatch[1].replace(/['"]/g, ""),
            );
          }
        }

        return response.blob().then((blob) => ({ blob, filename }));
      })
      .then(({ blob, filename }) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename || "document";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
  };

  return (
    <button type="button" onClick={handleDownload} className="cursor-pointer">
      {children}
    </button>
  );
};
