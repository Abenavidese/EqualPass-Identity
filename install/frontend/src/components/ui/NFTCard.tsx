import React from "react";

type Props = {
  title?: string;
  tokenId?: string | number | null;
  imageSrc?: string | null;
  onView?: () => void;
};

export const NFTCard: React.FC<Props> = ({ title = "EqualPass NFT", tokenId, imageSrc, onView }) => {
  return (
    <div
      className="rounded-lg p-4 w-72 bg-white shadow-xl border-2 border-transparent"
      style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,255,0.95))" }}
    >
      <div className="h-48 rounded-md overflow-hidden shadow-inner" style={{ background: "#f3f4f6" }}>
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt={title} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <div className="text-4xl">🎓</div>
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-sm text-gray-500">{title}</div>
        <div className="font-semibold text-lg mt-1">#{tokenId ?? "—"}</div>
        <div className="mt-3 flex gap-2">
          {onView && (
            <button
              onClick={onView}
              className="text-sm px-3 py-1 rounded bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow"
            >
              Ver
            </button>
          )}
          <button className="text-sm px-3 py-1 rounded border border-gray-200 text-gray-700">
            Compartir
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
