import { useForm } from "@mantine/form";
import useUserState, { UserStateType } from "state_providers/student";

export default function EditAccount() {
    const { state }: UserStateType = useUserState();
    const form = useForm({
        initialValues: {

        }
    });

    return (
        <div>EditAccount</div>
    );
}
