import React from "react";

export const Avatar = ({ avatarUrl, userName, onlineStatus, width, alt }) => {
  return (
    <div style={{ width: width, height: width }}>
      {onlineStatus !== undefined && (
        <div
          className="absolute rounded-full border-2 border-white w-4 h-4 bottom-0 -right-0.5"
          style={{
            backgroundColor: onlineStatus ? "#1dbf73" : "#a6a5a5",
          }}
        />
      )}
      {avatarUrl ? (
        <img src={avatarUrl} alt={alt} className="w-full h-full rounded-full" />
      ) : (
        <div className="w-full bg-no_focus h-full rounded-full flex items-center justify-center">
          <p className="text-off_white font-medium text-lg">
            {userName[0].toUpperCase()}
          </p>
        </div>
      )}
    </div>
  );
};
