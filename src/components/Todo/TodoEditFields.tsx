import TodoEditorContext from '@/common/contexts/todo-editor.context';
import { UserContext } from '@/common/contexts/user.context';
import { ITodoItem } from '@/common/interfaces/todo-interfaces';
import { axiosReqEditTodo } from '@/common/web/queries';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import TodoInputFormRaw from './TodoInputFormRaw';

export type TodoItemProps = ITodoItem & {
    handleDeleteItem: (id: string) => Promise<void>;
    handleUpdateItem: (item: ITodoItem) => Promise<void>;
};

export default function TodoEditFields({
    id,
    description,
    title,
    handleUpdateItem,
}: Pick<TodoItemProps, 'id' | 'handleUpdateItem' | 'description' | 'title'>) {
    const todoEditorContext = React.useContext(TodoEditorContext);
    const userContext = React.useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            title,
            description,
        },
        validationSchema: Yup.object().shape({
            title: Yup.string().required(),
            description: Yup.string(),
        }),
        onSubmit: async (values, actions) => {
            const updateReq = axiosReqEditTodo(userContext.user.token, id, {
                title,
                description,
            });
            await toast.promise(
                updateReq,
                {
                    loading: 'Updating todo item',
                    success: 'Item updated',
                    error: "Oops, couldn't update todo item",
                },
                { position: 'bottom-left' },
            );
            handleUpdateItem({ ...values, id });
            actions.setSubmitting(false);
            actions.setValues({ title: '', description: '' });
            todoEditorContext.setEditor({
                editingItemId: null,
                openCreate: false,
            });
        },
    });

    return <TodoInputFormRaw formik={formik} submitButtonValue={'Save'} />;
}
