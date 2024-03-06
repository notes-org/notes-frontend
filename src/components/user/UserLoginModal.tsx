import Modal, { ModalProps } from "@mui/material/Modal";
import { UserLoginForm } from "./UserLoginForm";

/**
 * Wraps UserLoginForm in a Modal
 */
export function UserLoginModal(props: Pick<ModalProps, 'open' | 'onClose'>) {
    return (
        <Modal {...props}>
            <UserLoginForm/>
        </Modal>
    )
}