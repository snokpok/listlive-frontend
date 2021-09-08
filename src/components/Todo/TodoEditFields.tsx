import TodoEditorContext from '@/common/contexts/todo-editor.context';
import { ITodoItem } from '@/common/interfaces/todo-interfaces';
import { useFormik } from 'formik';
import React from 'react';
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
            await handleUpdateItem({ ...values, id });
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
