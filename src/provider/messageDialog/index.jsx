import { useEffect, useRef } from "react";
import "./style.css"

export default function MessageDialog({
    open,
    title,
    message,
    onClose,
    type
}) {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (open) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [open]);

    return (
        <dialog
            id="messageDialog"
            ref={dialogRef}
            style={{
                width: "400px",
                maxWidth: "90vw",

                border: "none",
                borderRadius: "12px",
                padding: "0",

                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",

                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                margin: 0,
            }}
        >
            <div
                style={{
                    padding: "24px",
                    backgroundColor: "#fff",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: "20px",
                        fontWeight: "600",
                    }}
                >
                    {title}
                </h2>

                <p
                    style={{
                        marginTop: "16px",
                        marginBottom: "24px",
                        lineHeight: "1.5",
                        color: "#555",
                    }}
                >
                    {message}
                </p>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "12px",
                    }}
                >
                    {type !== "alert" ? (
                        <button
                            onClick={() => onClose(false)}
                            style={{
                                padding: "8px 16px",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                backgroundColor: "#fff",
                                cursor: "pointer",
                            }}
                        >
                            キャンセル
                        </button>
                    ) : (<></>)}

                    <button
                        onClick={() => onClose(true)}
                        style={{
                            padding: "8px 16px",
                            border: "none",
                            borderRadius: "6px",
                            backgroundColor: "#2563eb",
                            color: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        OK
                    </button>
                </div>
            </div>
        </dialog>
    );
}