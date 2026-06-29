import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useConfirm } from "../provider/ConfirmProvider";

const API_BASE = import.meta.env.VITE_API_BASE;

const LoginPage = () => {
    const navigate = useNavigate();
    const confirm = useConfirm();

    const [ inputType, setType ] = useState(true);

    const [ inputUsername, setInputUsername ] = useState("");
    const [ inputPassword, setInputPassword ] = useState("");

    const handleLogin = async () => {
        const formData = new FormData();
        formData.append("username", inputUsername);
        formData.append("password", inputPassword)

        const response = await fetch(`${API_BASE}/api/login.php`, {
            method: "POST",
            body: formData,
            credentials: "include"
        });

        const data = await response.json();

        if(response.ok && data.success) {
            navigate("/");
        } else {
            if(data.code == 1) {
                await confirm({
                    title: "エラー",
                    message: `プロトコルエラー\n長良クリエイトの担当者にお問い合わせしてください (${data.code})`,
                    type: "alert"
                })
            } else if(data.code == 2) {
                await confirm({ 
                    title: "エラー",
                    message: `データエラー\n長良クリエイトの担当者にお問い合わせしてください (${data.code})`,
                    type: "alert"
                });
            } else if(data.code == 3) {
                await confirm({ 
                    title: "エラー",
                    message: `パスワード または ユーザー名が違います`,
                    type: "alert"
                });
            } else {
                await confirm({
                    title: "エラー",
                    message: `不明なエラー:\n${data}`,
                    type: "alert"
                });
            }
        }
    }

    return (
        <div className="flex h-[100dvh] bg-gray-400">
            <div className="flex-1 w-2/3 bg-gray-400 overflow-y-auto flex-col p-2 md:m-[20px] md:ml-[0px] md:p-[10px]">
                <div className="fixed top-0 left-0 right-0 z-50 flex items-center p-[10px] gap-2 m-0 bg-neutral-100">
                    <h1 className="text-xl" style={{ margin: "auto" }}>ログイン</h1>
                </div>

                <div
                    className="md:w-[600px] md:m-auto md:mt-15 p-10 mt-13 bg-neutral-50"
                    style={{
                        textAlign: "left",
                        borderRadius: "15px"
                    }}
                >
                    <label className="select-none ms-2 text-sm font-medium text-heading">
                        <input
                            type="text"
                            style={{
                                fontSize: "1.5rem"
                            }}
                            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base leading-6 text-gray-900 placeholder:text-gray-500 shadow-sm transition-colors duration-150 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/25 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-100"
                            value={inputUsername}
                            onChange={(event) => setInputUsername(event.target.value)}
                            placeholder="ユーザー名"
                        />
                    </label>
                    <br />
                    <label className="select-none ms-2 text-sm font-medium text-heading">
                        <input
                            type={inputType ? "password" : "text"}
                            style={{
                                fontSize: "1.5rem"
                            }}
                            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base leading-6 text-gray-900 placeholder:text-gray-500 shadow-sm transition-colors duration-150 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/25 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-100"
                            value={inputPassword}
                            onChange={(event) => setInputPassword(event.target.value)}
                            placeholder="パスワード"
                        />
                    </label>
                    <br />
                    <label
                        className="inline-flex items-center gap-2"
                    >
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-400 text-blue-600 transition-colors focus:ring-4 focus:ring-blue-500/25 focus:ring-offset-0"
                            onChange={() => { setType(!inputType) }}
                        />
                        パスワードを表示
                    </label>
                    <br />
                    <br />
                    <div style={{ textAlign: "center" }}>
                        <button
                            className="inline-flex h-9 items-center justify-center rounded-md bg-blue-500 px-3 font-medium text-neutral-50 hover:bg-blue-800 cursor-pointer"
                            onClick={handleLogin}
                        >ログイン</button><br />
                        <br />
                        <div className="text-blue-600 underline">
                            <NavLink to="/register">アカウント作成</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;