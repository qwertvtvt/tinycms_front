import { useState, useEffect, useRef } from "react";

import { NavLink } from "react-router-dom";

import ImageDialog from "../components/imageDialog";
import { useConfirm } from "../provider/ConfirmProvider"

const ManagerPage = () => {
    const confirm = useConfirm();

    const [ isOpen, setIsOpen ] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const [ articles, setArticles ] = useState([]);
    const [ openedImages, setImages ] = useState([]);

    const [ selectedFile, setSelectedFile ] = useState(null);

    useEffect(function() {
        (async () => {
            const data = await (await fetch("http://localhost:3000/api/me.php", {
                credentials: "include"
            })).json();
            if(!data.logged_in) {
                location.href = "./login";
            }
        })();
    }, []);

    const loadArticles = async () => {
        const data = await (await fetch("http://localhost:3000/api/get_articles.php")).json();
        setArticles(data);
    }

    useEffect(function() {
        loadArticles();
    }, []);

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

    useEffect(function() {
        console.log(articles);
    }, [articles]);

    useEffect(function() {
        console.log(openedImages);
    }, [openedImages]);

    function handleEditButton(id) {
        console.log(`Edit Button Clicked: ${id}`);
    }

    async function handleDeleteButton(id) {
        const ok = await confirm({
            title: "確認",
            message: "本当に削除しますか？"
        });

        if(!ok) return;

        const data = new URLSearchParams({
            id
        });

        fetch("http://localhost:3000/api/delete_article.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: data,
            credentials: "include"
        });

        loadArticles();
    }

    function handleImageButton(id) {
        if(!openedImages.includes(id)) {
            setImages([...openedImages, id])
        } else {
            setImages(openedImages.filter(elem => elem != id));
        }
    }

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
                    <NavLink to="/add">
                        お知らせを追加する
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
                    <h1 className="text-xl">お知らせ一覧</h1>
                </div>
                <br />
                <div className="pt-13">
                    {articles && articles.map((article) => (
                        <div key={article.id} className="mb-1 p-2 bg-white rounded shadow mb-5">
                            <span className='text-lg'>{article.title}</span> | <small>{new Date(article.post_at).toLocaleString()}</small>
                            <hr />
                            <br />
                            {article.content}<br />
                            <br />
                            {article.has_images == 1 && (
                                <>
                                    <button
                                        className="text-emerald-600"
                                        onClick={(() => handleImageButton(article.id))}
                                    >
                                        画像を{openedImages.includes(article.id) ? "閉じる" : "開く"} ({article.images.length}枚)
                                    </button>
                                    {openedImages.includes(article.id) && (
                                        <div className="flex">
                                            {article.images.map((image, index) => (
                                                <img key={index}
                                                    src={"http://localhost:3000/uploads/" + image}
                                                    style={{ width: (1 / article.images.length * 100)+"%", cursor: "pointer" }}
                                                    onClick={() => setSelectedFile(image)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                            <hr />
                            <div className="p-[7px] pb-0 pl-0">
                                <button
                                    className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 font-medium text-neutral-50 hover:bg-blue-800 cursor-pointer"
                                    onClick={(() => handleEditButton(article.id))}
                                >
                                    編集
                                </button>
                                <button
                                    className="inline-flex h-9 items-center justify-center rounded-md bg-rose-600 px-3 font-medium text-neutral-50 hover:bg-red-800 cursor-pointer ml-1"
                                    onClick={(() => handleDeleteButton(article.id))}
                                >
                                    削除
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ImageDialog
                file={selectedFile}
                onClose={() => setSelectedFile(null)}
            />
        </div>
    );
}

export default ManagerPage;