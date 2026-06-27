import { useEffect, useRef, useState } from "react";
import "./style.css"

export default function ImageDialog({ file, onClose }) {
    const dialogRef = useRef(null);
    const imgRef = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!file) {
            dialogRef.current?.close();
            return;
        }

        const img = new Image();
        img.src = `http://localhost:3000/uploads/${file}`;

        img.onload = () => {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const maxWidth = window.innerWidth * 0.9;
            const maxHeight = window.innerHeight * 0.9;

            let width, height;

            if (
                img.naturalWidth > maxWidth ||
                img.naturalHeight > maxHeight
            ) {
                if (maxWidth / aspectRatio <= maxHeight) {
                    width = maxWidth;
                    height = maxWidth / aspectRatio;
                } else {
                    height = maxHeight;
                    width = maxHeight * aspectRatio;
                }
            } else {
                width = img.naturalWidth;
                height = img.naturalHeight;
            }

            setSize({ width, height });

            const scrollY = window.scrollY;
            dialogRef.current?.showModal();
            window.scrollTo(0, scrollY);
        };
    }, [file]);

    return (
        <dialog
            ref={dialogRef}
            id="imageDialog"
            style={{
                width: `${size.width}px`,
                height: `${size.height}px`,
            }}
        >
            <button
                id="closeBtn"
                aria-label="Close"
                onClick={() => {
                    dialogRef.current?.close();
                    onClose?.();
                }}
            />
            <img
                ref={imgRef}
                id="image"
                src={file ? `http://localhost:3000/uploads/${file}` : null}
                alt=""
            />
        </dialog>
    );
}