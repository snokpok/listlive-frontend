import TodoEditorContext, {
    EditorAttribs,
} from '@/common/contexts/todo-editor.context';
import { UserContext } from '@/common/contexts/user.context';
import { ITodoItem } from '@/common/interfaces/todo-interfaces';
import {
    axiosReqDeleteTodo,
    axiosReqEditTodo,
    axiosReqGetTodoList,
} from '@/common/web/queries';
import React from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { BarLoader } from 'react-spinners';
import TodoCreatorFields from './TodoCreatorFields';
import TodoItem from './TodoItem';

export const NoItemsPlaceholder = () => {
    return (
        <div className="text-gray-400 italic">
            📝 Oh well... there's nothing; get something done today!
        </div>
    );
};

export default function TodoList() {
    const userContext = React.useContext(UserContext);

    const [editor, setEditor] = React.useState<EditorAttribs>({
        editingItemId: null,
        openCreate: false,
    });
    const [todoList, setTodoList] = React.useState<ITodoItem[]>([]);

    const queryTodoList = useQuery('todos-list-query', async () => {
        const { data } = await axiosReqGetTodoList(userContext.user.token);
        setTodoList(data);
        return data;
    });

    const deleteItemHandler = async (id: string) => {
        const deleteReq = axiosReqDeleteTodo(userContext.user.token, id);
        await deleteReq;
        setTodoList((prev) => {
            return prev.filter((obj) => obj.id !== id);
        });
    };

    const updateItemHandler = async ({ id, title, description }: ITodoItem) => {
        const updateReq = axiosReqEditTodo(userContext.user.token, id, {
            title,
            description,
        });
        await toast.promise(
            updateReq,
            {
                loading: 'Creating todo item',
                success: 'Created',
                error: "Couldn't create todo item",
            },
            { position: 'bottom-left' },
        );
        setTodoList((prev) => {
            const indexItemUpdate = prev.findIndex((item) => item.id === id);
            const newList = prev;
            newList[indexItemUpdate] = { id, title, description };
            return newList;
        });
    };

    if (queryTodoList.isError) {
        toast.error('Oops, something went wrong');
    }
    return (
        <TodoEditorContext.Provider value={{ editor, setEditor }}>
            <div className="flex flex-col w-96 max-w-lg max-h-full overflow-y-auto">
                {!queryTodoList.data ? <BarLoader loading={true} /> : null}
                <div className="p-2">
                    {todoList.length === 0 ? (
                        <NoItemsPlaceholder />
                    ) : (
                        todoList.map((item: ITodoItem) => {
                            return (
                                <div key={item.id}>
                                    <TodoItem
                                        {...item}
                                        handleDeleteItem={deleteItemHandler}
                                        handleUpdateItem={updateItemHandler}
                                    />
                                </div>
                            );
                        })
                    )}
                </div>
                <TodoCreatorFields setTodoList={setTodoList} />
            </div>
        </TodoEditorContext.Provider>
    );
}
