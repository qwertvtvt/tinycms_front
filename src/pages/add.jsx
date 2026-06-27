import { useState, useEffect, useRef } from "react";

import { NavLink } from "react-router-dom";

import { useConfirm } from "../provider/ConfirmProvider"

const AddPage = () => {
    const confirm = useConfirm();

    const [ inputTitle, setInputTitle ] = useState("");
    const [ inputContent, setInputContent ] = useState("");
    const [ selectedFiles, setSelectedFiles ] = useState([]);

    const [ isOpen, setIsOpen ] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleSubmit = async () => {
        const formData = new FormData();
        
        formData.append("title", inputTitle);
        formData.append("content", inputContent);

        selectedFiles.forEach((file) => {
            formData.append("images[]", file)
        });

        try {
            const response = await fetch("http://localhost:3000/api/post_article.php", {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            const data = await response.json();

            if(response.ok || data.success) {
                location.href = "/manager";
                return;
            } else {
                if(data.code == 4) {
                    await confirm({
                        title: "エラー",
                        message: `ログインしていません (${data.code})`,
                        type: "alert"
                    });
                } else if(data.code == 3) {
                    await confirm({ 
                        title: "エラー",
                        message: `データエラー\n長良クリエイトの担当者にお問い合わせしてください (${data.code})`,
                        type: "alert"
                    });
                } else if(data.code == 2) {
                    await confirm({
                        title: "エラー",
                        message: `タイトルと本文をすべて入力してください (${data.code})`,
                        type: "alert"
                    });
                } else if(data.code == 1) {
                    await confirm({
                        title: "エラー",
                        message: `プロトコルエラー\n長良クリエイトの担当者にお問い合わせしてください (${data.code})`,
                        type: "alert"
                    })
                } else {
                    await confirm({
                        title: "エラー",
                        message: `不明なエラー:\n${data}`,
                        type: "alert"
                    });
                }
            }
        } catch (error) {
            console.log("エラー:", error);
            await confirm({
                title: "エラー",
                message: `通信エラーが発生しました:\n${error}`,
                type: "alert"
            });
        }
    }

    useEffect(() => {
        const touchStart = (e) => {
            touchStartX.current = e.changedTouches[0].screenX;
        }

        const touchEnd = (e) => {
            touchEndX.current = e.changedTouches[0].screenX;
            handleGesture();
        }

        const handleGesture = () => {
            const diff = touchEndX.current - touchStartX.current;

            if(diff > 50) {
                setIsOpen(true);
            }
            if(diff < -50) {
                setIsOpen(false);
            }
        }

        window.addEventListener("touchstart", touchStart);
        window.addEventListener("touchend", touchEnd);

        return () => {
            window.removeEventListener("touchstart", touchStart);
            window.removeEventListener("touchend", touchEnd);
        };
    }, []);

    return (
        <div className="flex h-[100dvh] bg-gray-400">
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-60 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className={`
                fixed inset-y-0 left-0 z-100 w-3/4 max-w-sm bg-gray-100 p-4 transition-transform duration-300 ease-in-out transform
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                md:relative md:translate-x-0 md:w-1/3 md:m-[20px] md:p-[10px] overflow-y-auto
            `}>
                <div className="flex justify-between items-center mb-4">
                    <h1 className='text-3xl'>メニュー</h1>
                    <button onClick={() => setIsOpen(false)} className="text-2xl p-2 md:hidden">✕</button>
                </div>
                <br />
                <button
                    className="w-1/1 h-[70px] bg-gray-500 text-neutral-50 text-xl font-extrabold rounded-lg"
                >
                    <NavLink to="/">
                        ホームへ戻る
                    </NavLink>
                </button><br />
                <br />
                <hr />
                <br />
                <button
                    className="w-1/1 h-[70px] bg-gray-500 text-neutral-50 text-xl font-extrabold rounded-lg"
                >
                    <NavLink to="/manager">
                        お知らせを管理する
                    </NavLink>
                </button>
            </div>
            <div className="flex-1 w-2/3 bg-gray-400 overflow-y-auto flex-col p-2 md:m-[20px] md:ml-[0px] md:p-[10px]">
                <div className="fixed top-0 left-0 right-0 z-50 flex items-center p-[10px] gap-2 m-0 bg-neutral-100">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="md:hidden p-2 rounded hover:bg-gray-200"
                    >
                        ☰
                    </button>
                    <h1 className="text-xl">お知らせ追加</h1>
                </div>

                <div
                    className="p-10 mt-15 bg-neutral-50"
                    style={{
                        textAlign: "left",
                        borderRadius: "15px"
                    }}
                >
                    <label className="select-none ms-2 text-sm font-medium text-heading">
                        タイトル<br />
                        <input
                            style={{
                                fontSize: "1.5rem"
                            }}
                            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base leading-6 text-gray-900 placeholder:text-gray-500 shadow-sm transition-colors duration-150 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/25 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-100"
                            placeholder="タイトル"
                            value={inputTitle}
                            onChange={(event) => setInputTitle(event.target.value)}
                        />
                    </label>
                    <br />
                    <label className="select-none ms-2 text-sm font-medium text-heading">
                        本文<br />
                        <textarea
                            style={{
                                fontSize: "1.5rem"
                            }}
                            className="block w-full h-[100px] rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base leading-6 text-gray-900 placeholder:text-gray-500 shadow-sm transition-colors duration-150 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/25 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-100"
                            placeholder="本文"
                            onChange={(event) => setInputContent(event.target.value)}
                        />
                    </label>
                    <br />
                    <label className="select-none ms-2 text-sm font-medium text-heading">
                        画像<br />
                        <input
                            type="file"
                            className="block w-full rounded-md border border-gray-300 bg-white text-sm text-gray-900 shadow-sm
                                        file:mr-4 file:border-0 file:border-r file:border-gray-300
                                        file:bg-gray-100 file:px-3 file:py-2
                                        file:text-sm file:font-normal file:text-gray-700
                                        hover:file:bg-gray-200
                                        focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/25
                                        disabled:cursor-not-allowed disabled:opacity-50"
                            multiple
                            onChange={(event) => {
                                if(event.target.files) {
                                    setSelectedFiles(Array.from(event.target.files));
                                }
                            }}
                        />
                    </label>
                    (画像は後で追加・削除・変更できません)<br />
                    <br />

                    <div style={{ textAlign: "center" }}>
                        <button
                            className="inline-flex h-9 items-center justify-center rounded-md bg-blue-500 px-3 font-medium text-neutral-50 hover:bg-blue-800 cursor-pointer"
                            onClick={handleSubmit}
                        >
                            投稿
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddPage;