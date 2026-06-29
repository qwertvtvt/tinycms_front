import { useState, useEffect, useRef } from "react";

import { NavLink, useNavigate } from "react-router-dom";

import ImageDialog from "../components/imageDialog";
import { useConfirm } from "../provider/ConfirmProvider"

const API_BASE = import.meta.env.VITE_API_BASE;

const ManagerPage = () => {
    const confirm = useConfirm();
    const navigate = useNavigate();

    const [ isOpen, setIsOpen ] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const [ articles, setArticles ] = useState([]);
    const [ openedImages, setImages ] = useState([]);

    const [ selectedFile, setSelectedFile ] = useState(null);

    useEffect(function() {
        (async () => {
            const data = await (await fetch(`${API_BASE}/api/me.php`, {
                credentials: "include"
            })).json();
            if(!data.logged_in) {
                navigate("/login");
            }
        })();
    }, []);

    const loadArticles = async () => {
        const data = await (await fetch(`${API_BASE}/api/get_articles.php`)).json();
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

    async function handleDeleteButton(id) {
        const ok = await confirm({
            title: "確認",
            message: "本当に削除しますか？\n削除すると復元できません"
        });

        if(!ok) return;

        const data = new URLSearchParams({
            id
        });

        fetch(`${API_BASE}/api/delete_article.php`, {
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

    function nl2br(str = "") {
        return str.replace(/\r\n|\n\r|\r|\n/g, "<br />");
    }

    return (
        <div className="flex h-[100dvh] bg-gray-400">
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-55"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className={`
                fixed inset-y-0 left-0 z-60 w-3/4 max-w-sm bg-gray-100 p-4 transition-transform duration-300 ease-in-out transform
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                overflow-y-auto
            `}>
                <div className="flex justify-between items-center mb-4">
                    <h1 className='text-3xl'>メニュー</h1>
                    <button onClick={() => setIsOpen(false)} className="text-2xl p-2">✕</button>
                </div>  
                <br />
                <NavLink to="/">
                    <button
                        className="w-1/1 h-[70px] bg-gray-500 text-neutral-50 text-xl font-extrabold rounded-lg"
                    >
                        ホームへ戻る
                    </button>
                </NavLink><br />
                <br />
                <hr />
                <br />
                <NavLink to="/add">
                    <button
                        className="w-1/1 h-[70px] bg-gray-500 text-neutral-50 text-xl font-extrabold rounded-lg"
                    >
                        お知らせを追加する
                    </button>
                </NavLink>
            </div>
            <div className="flex-1 w-2/3 bg-gray-400 overflow-y-auto flex-col p-2 md:m-[20px] md:ml-[0px] md:p-[10px]">
                <div className="md:flex md:justify-center md:pl-[40%] md:pr-[40%] fixed top-0 left-0 right-0 z-50 flex items-center p-[10px] gap-2 m-0 bg-neutral-100">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-2 rounded hover:bg-gray-200"
                    >
                        ☰
                    </button>
                    <h1 className="text-xl md:ml-[20px]">お知らせ一覧</h1>
                </div>
                <br />
                <div className="pt-13">
                    {articles.length > 0 ? articles.map((article) => (
                        <div key={article.id} className="md:w-[600px] md:m-auto md:mb-5 p-2 bg-white rounded shadow mb-5">
                            <span className='text-lg'>{article.title}</span> | <small>{new Date(article.post_at).toLocaleString()}</small>
                            <hr />
                            <br />
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: nl2br(article.content)
                                }}
                            />
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
                                            {article.images
                                                .filter(image => image)
                                                .map((image, index) => (
                                                    <img key={index}
                                                        src={`${API_BASE}/uploads/${image}`}
                                                        style={{ width: (1 / article.images.length * 100)+"%", cursor: "pointer" }}
                                                        onClick={() => setSelectedFile(image)}
                                                    />
                                                ))
                                            }
                                        </div>
                                    )}
                                </>
                            )}
                            <hr />
                            <div className="p-[7px] pb-0 pl-0">
                                <button
                                    className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 font-medium text-neutral-50 hover:bg-blue-800 cursor-pointer"
                                    onClick={() => {
                                        navigate("/edit", {
                                            state: {
                                                article
                                            }
                                        });
                                    }}
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
                    )) : (
                        <div
                            className="md:w-[600px] md:m-auto p-10 mt-15 bg-neutral-50"
                            style={{
                                textAlign: "center",
                                borderRadius: "15px"
                            }}
                        >
                            <h2 className="text-xl m-3">お知らせはまだありません</h2>
                            <NavLink to="/add">
                                <button
                                    className="w-1/1 h-[70px] bg-gray-500 text-neutral-50 text-xl font-extrabold rounded-lg"
                                >
                                    お知らせを追加する
                                </button>
                            </NavLink>
                        </div>
                    )}
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