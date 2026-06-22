import { useState } from "react";

const LoginPage = () => {
    const [ inputType, setType ] = useState(true);

    return (
        <div className="flex h-[100dvh] bg-gray-400">
            <div className="flex-1 w-2/3 bg-gray-400 overflow-y-auto flex-col p-2 md:m-[20px] md:ml-[0px] md:p-[10px]">
                <div className="fixed top-0 left-0 right-0 z-50 flex items-center p-[10px] gap-2 m-0 bg-neutral-100">
                    <h1 className="text-xl" style={{ margin: "auto" }}>ログイン</h1>
                </div>

                <div className="p-10 mt-13" style={{ textAlign: "center", borderRadius: "15px", backgroundColor: "white" }}>
                    <input type="text" className="bg-neutral-200" style={{ borderRadius: "5px", fontSize: "1.5rem", margin: "5px", padding: "2px" }} /><br />
                    <input type={inputType ? "password" : "text"} className="bg-neutral-200" style={{ borderRadius: "5px", fontSize: "1.5rem", margin: "5px", padding: "2px" }} /><br />
                    <label><input type="checkbox" onChange={() => { setType(!inputType) }} />パスワードを表示</label>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;