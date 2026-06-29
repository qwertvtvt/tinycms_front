import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

const Home = () => {
    const navigate = useNavigate();

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

    return (
        <div className="flex h-[100dvh] bg-gray-400">
            <div className="flex-1 w-2/3 bg-gray-400 overflow-y-auto flex-col p-2 md:m-[20px] md:ml-[0px] md:p-[10px]">
                <div className="fixed top-0 left-0 right-0 z-50 flex items-center p-[10px] gap-2 m-0 bg-neutral-100">
                    <h1 className="text-xl" style={{ margin: "auto" }}>TinyCMS</h1>
                </div>

                <div
                    className="md:w-[600px] md:m-auto md:mt-15 p-10 mt-15 bg-neutral-50"
                    style={{
                        textAlign: "center",
                        borderRadius: "15px"
                    }}
                >
                    <h2 className="text-xl m-3">操作を選択してください</h2>
                    <NavLink to="/add">
                        <button
                            className="w-1/1 h-[70px] bg-gray-500 text-neutral-50 text-xl font-extrabold rounded-lg"
                        >
                            お知らせを追加する
                        </button>
                    </NavLink><br />
                    <br />
                    <hr />
                    <br />
                    <NavLink to="/manager">
                        <button
                            className="w-1/1 h-[70px] bg-gray-500 text-neutral-50 text-xl font-extrabold rounded-lg"
                        >
                            お知らせを管理する
                        </button>
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default Home;