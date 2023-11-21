import React, { useState, DragEvent } from "react";
import { css } from "@emotion/react";
import Image from "next/image";
import { colors } from "./constant/color";

interface DropzoneProps {
  onFileAdded: (file: File) => void;
  isDisabled?: boolean;
  defaultThumbnail?: string | null;
}

export default function Dropzone({
  onFileAdded,
  isDisabled = false,
  defaultThumbnail = null,
}: DropzoneProps) {
  const [highlight, setHighlight] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<string | null>(defaultThumbnail); // 단일 썸네일 상태

  const updateThumbnail = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnail(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const openFileDialog = () => {
    if (isDisabled) return;
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput?.click();
  };

  const onFileAddedEvt = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    const {
      target: { files },
    } = event;
    if (files && files[0]) {
      updateThumbnail(files[0]);
      onFileAdded(files[0]);
    }
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isDisabled) return;
    setHighlight(true);
  };

  const onDragLeave = () => {
    setHighlight(false);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isDisabled) return;
    const {
      dataTransfer: { files },
    } = event;
    if (files && files[0]) {
      updateThumbnail(files[0]);
      onFileAdded(files[0]);
    }
    setHighlight(false);
  };

  return (
    <div
      css={css`
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
      `}
    >
      <div
        css={css`
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          border: ${highlight
            ? `2px solid ${colors.grey600}`
            : `2px dashed ${colors.grey300}`};
          border-radius: 10px;
          padding: 1rem;
          text-align: center;
          transition: border 0.24s ease-in-out;
          background-color: ${highlight ? colors.blue300 : colors.white};
          color: ${colors.grey600};
          font-size: 1rem;
          cursor: ${isDisabled ? "default" : "pointer"};
          &:hover {
            border: ${isDisabled ? "" : `2px solid ${colors.grey600}`};
          }
        `}
        role="button"
        tabIndex={0}
        onClick={openFileDialog}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onKeyDown={(e) => {
          e.preventDefault();
          if (e.key === "Enter") {
            openFileDialog();
          }
        }}
      >
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          css={css`
            display: none;
          `}
          onChange={onFileAddedEvt}
        />
        {thumbnail ? (
          <div
            css={css`
              position: relative;
              display: flex;
              justify-content: center;
              width: 100%;
              aspect-ratio: 1;
              border-radius: 50%;
              overflow: hidden;
            `}
          >
            <img
              src={thumbnail}
              alt="Thumbnail"
              css={css`
                width: 100%;
                height: 100%;
                object-fit: contain;
              `}
            />
          </div>
        ) : (
          <div
            css={css`
              font-size: 1.5rem;
            `}
          >
            {highlight
              ? "여기다가 끌어주세요!"
              : "파일을 드래그하거나 입력해주세요."}
          </div>
        )}
      </div>
    </div>
  );
}
