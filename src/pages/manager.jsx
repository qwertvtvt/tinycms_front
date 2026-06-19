import { useState, useEffect, useRef } from "react";

const ManagerPage = () => {
    const [ isOpen, setIsOpen ] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const [ articles, setArticles ] = useState([]);

    useEffect(function() {
        (async () => {
            const data = await (await fetch("http://localhost:3000/api/get_articles.php")).json();
            setArticles(data);
        })();
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
    });

    useEffect(function() {
        console.log(articles);
    }, [articles]);

    return (
        <div className="flex h-[100dvh] bg-gray-400">
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className={`
                fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-gray-100 p-4 transition-transform duration-300 ease-in-out transform
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                md:relative md:translate-x-0 md:w-1/3 md:m-[20px] md:p-[10px] overflow-y-auto
            `}>
                <div className="flex justify-between items-center mb-4">
                    <h1 className='text-3xl'>メニュー</h1>
                    <button onClick={() => setIsOpen(false)} className="text-2xl p-2 md:hidden">✕</button>
                    </div>
                    <br />
                </div>
                <div className="flex-1 w-2/3 bg-gray-100 overflow-y-auto flex-col p-2 md:m-[20px] md:ml-[0px] md:p-[10px]">
                    <div className="flex items-center gap-2 mb-2">
                        <button
                            onClick={() => setIsOpen(true)}
                            className="md:hidden p-2 rounded hover:bg-gray-200"
                        >
                            ☰
                        </button>
                        <h1 className="text-xl">お知らせ一覧</h1>
                    </div>
                    <hr />
                    <br />
                    {articles && articles.map((article) => (
                        <div key={article.id} className="mb-1 p-2 bg-white rounded shadow">
                            <span className='text-lg'>{article.title}</span> | <small>{new Date(article.post_at).toLocaleString()}</small>
                            <hr />
                            <br />
                            {article.content}<br />
                            <br />
                            <hr />
                            {article.has_images == 1 && (
                                <>
                                </>
                            )}
                            <div className="p-[7px] pb-0 pl-0">
                                <button
                                    className="inline-flex h-9 items-center justify-center rounded-md bg-blue-500 px-3 font-medium text-neutral-50 hover:bg-blue-800 cursor-pointer"
                                >
                                    編集
                                </button>
                                <button
                                    className="inline-flex h-9 items-center justify-center rounded-md bg-red-500 px-3 font-medium text-neutral-50 hover:bg-red-800 cursor-pointer"
                                >
                                    削除
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
    );
}

export default ManagerPage;