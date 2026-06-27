import {
    createContext,
    useContext,
    useRef,
    useState,
} from "react";
import MessageDialog from "./messageDialog";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
    const [dialog, setDialog] = useState(null);

    const resolverRef = useRef(null);

    const confirm = ({ title, message, type }) => {
        return new Promise((resolve) => {
            resolverRef.current = resolve;

            setDialog({
                title,
                message,
                type
            });
        });
    };

    const handleClose = (result) => {
        resolverRef.current?.(result);
        resolverRef.current = null;

        setDialog(null);
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}

            <MessageDialog
                open={!!dialog}
                title={dialog?.title}
                message={dialog?.message}
                onClose={handleClose}
                type={dialog?.type}
            />
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    return useContext(ConfirmContext);
}