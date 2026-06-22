import {
    createContext,
    useContext,
    useRef,
    useState,
} from "react";
import MessageDialog from "./MessageDialog";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
    const [dialog, setDialog] = useState(null);

    const resolverRef = useRef(null);

    const confirm = ({ title, message }) => {
        return new Promise((resolve) => {
            resolverRef.current = resolve;

            setDialog({
                title,
                message,
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
            />
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    return useContext(ConfirmContext);
}