"use client";

import React, { useState } from "react";
import { BiUser } from "react-icons/bi";

type UserAvatarProps = {
  src?: string | null;
  name?: string | null;
  email?: string | null;
  className?: string;
  iconClassName?: string;
};

export default function UserAvatar({
  src,
  name,
  email,
  className = "w-16 h-16 rounded-full bg-[#1c2234] border border-[#283147] overflow-hidden flex items-center justify-center text-xl font-semibold uppercase text-slate-200 shrink-0",
  iconClassName = "text-slate-300 text-3xl",
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const initial = name?.trim()?.[0] ?? email?.trim()?.[0] ?? null;

  if (src && !imageError) {
    return (
      <div className={className}>
        <img
          src={src}
          alt={name ?? "User profile picture"}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {initial ? (
        <span>{initial}</span>
      ) : (
        <BiUser className={iconClassName} />
      )}
    </div>
  );
}
