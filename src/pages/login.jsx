import { useState } from "react";

const LoginPage = () => {
    const [ inputType, setType ] = useState(true);

    const [ inputUsername, setInputUsername ] = useState("");
    const [ inputPassword, setInputPassword ] = useState("");

    const handleLogin = async () => {
        const formData = new FormData();
        formData.append("username", inputUsername);
        formData.append("password", inputPassword)

        const result = await (await fetch("http://localhost:3000/api/login.php", {
            method: "POST",
            body: formData,
            credentials: "include"
        })).json();

        console.log(result);
    }

    return (
        <div className="flex h-[100dvh] bg-gray-400">
            <div className="flex-1 w-2/3 bg-gray-400 overflow-y-auto flex-col p-2 md:m-[20px] md:ml-[0px] md:p-[10px]">
                <div className="fixed top-0 left-0 right-0 z-50 flex items-center p-[10px] gap-2 m-0 bg-neutral-100">
                    <h1 className="text-xl" style={{ margin: "auto" }}>ログイン</h1>
                </div>

                <div
                    className="p-10 mt-13 bg-neutral-200/90"
                    style={{
                        textAlign: "left",
                        borderRadius: "15px"
                    }}
                >
                    <label className="select-none ms-2 text-sm font-medium text-heading">
                        ユーザー名<br />
                        <input
                            type="text"
                            style={{
                                borderRadius: "5px",
                                fontSize: "1.5rem",
                                margin: "5px",
                                padding: "2px",
                                backgroundColor: "white"
                            }}
                            value={inputUsername}
                            onChange={(event) => setInputUsername(event.target.value)}
                        />
                    </label>
                    <br />
                    <label className="select-none ms-2 text-sm font-medium text-heading">
                        パスワード
                        <input
                            type={inputType ? "password" : "text"}
                            style={{
                                borderRadius: "5px",
                                fontSize: "1.5rem",
                                margin: "5px",
                                padding: "2px",
                                backgroundColor: "white"
                            }}
                            value={inputPassword}
                            onChange={(event) => setInputPassword(event.target.value)}
                        />
                    </label>
                    <br />
                    <label
                        className="select-none ms-2 text-sm font-medium text-heading"
                    >
                        <input
                            type="checkbox"
                            className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
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
                        >ログイン</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;