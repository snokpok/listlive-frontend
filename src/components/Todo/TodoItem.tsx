import TodoEditorContext from '@/common/contexts/todo-editor.context';
import { UserContext } from '@/common/contexts/user.context';
import { axiosReqDeleteTodo } from '@/common/web/queries';
import axios from 'axios';
import React from 'react';
import { ReactElement } from 'react';
import toast from 'react-hot-toast';
import { AiFillCloseCircle } from 'react-icons/ai';
import { BsCheck } from 'react-icons/bs';
import { useMutation } from 'react-query';
import EditTodoWidget from './EditTodoWidget';
import TodoEditFields, { TodoItemProps } from './TodoEditFields';

export const CheckOffItem = ({
    id,
    handleDeleteItem,
}: Pick<TodoItemProps, 'handleDeleteItem' | 'id'>) => {
    const userContext = React.useContext(UserContext);

    const mutationCheckOffItem = useMutation(async (id: string) => {
        const axiosCheckOff = axiosReqDeleteTodo(userContext.user.token, id);
        const { data } = await toast.promise(
            axiosCheckOff,
            {
                loading: 'Checking off...',
                success: 'Hurray!!!! Nice job',
                error: 'Oops something went wrong',
            },
            { icon: '🎊', position: 'bottom-right' },
        );
        handleDeleteItem(id);
    });

    return (
        <div className="p-1 mr-2">
            <div className="border-2 border-black bg-gray-100 rounded-full">
                <BsCheck
                    className="text-lg hover:opacity-100 opacity-0 font-bold transition m-1 cursor-pointer"
                    onClick={() => {
                        mutationCheckOffItem.mutate(id);
                    }}
                />
            </div>
        </div>
    );
};

export default function TodoItem({
    id,
    title,
    description,
    handleDeleteItem,
    handleUpdateItem,
}: TodoItemProps): ReactElement | null {
    const todoEditorContext = React.useContext(TodoEditorContext);
    const userContext = React.useContext(UserContext);

    if (todoEditorContext.editor.editingItemId === id)
        return (
            <TodoEditFields
                id={id}
                title={title}
                description={description}
                handleUpdateItem={handleUpdateItem}
            />
        );

    return (
        <div
            className="group bg-white rounded-md flex border-opacity-20 border-b-2 border-black px-2 py-3 justify-between"
            key={id}
        >
            <div className="flex">
                <CheckOffItem id={id} handleDeleteItem={handleDeleteItem} />
                <div className="flex flex-col">
                    <div className="font-semibold">{title}</div>
                    <div className="text-sm text-gray-500">{description}</div>
                </div>
            </div>
            <div className="flex flex-col justify-self-end space-y-1">
                <AiFillCloseCircle
                    className="hover:text-red-500 transition-colors text-lg cursor-pointer"
                    onClick={async () => {
                        await axiosReqDeleteTodo(userContext.user.token, id);
                        handleDeleteItem(id);
                    }}
                />
                <EditTodoWidget id={id} />
            </div>
        </div>
    );
}
