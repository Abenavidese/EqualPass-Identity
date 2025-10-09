import React from "react";

type Props = {
  title?: string;
  tokenId?: string | number | null;
  imageSrc?: string | null;
  onView?: () => void;
};

export const NFTCard: React.FC<Props> = ({ title = "EqualPass NFT", tokenId, imageSrc, onView }) => {
  return (
    <div className="border rounded p-4 w-64 bg-white shadow-sm">
      <div className="h-40 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt={title} className="object-cover w-full h-full" />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-sm text-gray-600">{title}</div>
        <div className="font-medium">Token #{tokenId ?? "—"}</div>
        {onView && (
          <button className="mt-2 text-sm text-indigo-600 hover:underline" onClick={onView}>
            View
          </button>
        )}
      </div>
    </div>
  );
};

export default NFTCard;
