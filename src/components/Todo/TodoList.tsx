import TodoEditorContext, {
    EditorAttribs,
} from '@/common/contexts/todo-editor.context';
import { UserContext } from '@/common/contexts/user.context';
import { ITodoItem } from '@/common/interfaces/todo-interfaces';
import {
    axiosReqDeleteTodo,
    axiosReqEditTodo,
    axiosReqEditTodoOrder,
    axiosReqGetTodoList,
} from '@/common/web/queries';
import React from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { BarLoader } from 'react-spinners';
import TodoCreatorFields from './TodoCreatorFields';
import TodoItem from './TodoItem';
import {
    DragDropContext,
    Draggable,
    Droppable,
    OnDragEndResponder,
} from 'react-beautiful-dnd';
import { AiFillPropertySafety } from 'react-icons/ai';

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
        setTodoList((prev) => {
            return prev.filter((obj) => obj.id !== id);
        });
    };

    const updateItemHandler = async ({ id, title, description }: ITodoItem) => {
        setTodoList((prev) => {
            const indexItemUpdate = prev.findIndex((item) => item.id === id);
            const newList = prev;
            newList[indexItemUpdate] = { id, title, description };
            return newList;
        });
    };

    const handleDragEndTodoItem: OnDragEndResponder = async (result) => {
        if (!result.destination) return;

        const newArrayTodos = Array.from(todoList);
        const [poppedItem] = newArrayTodos.splice(result.source.index, 1);
        newArrayTodos.splice(
            result.destination?.index ?? result.source.index,
            0,
            poppedItem,
        );
        setTodoList(newArrayTodos);
        const res = axiosReqEditTodoOrder(userContext.user.token, {
            itemId: result.draggableId,
            newOrder: result.destination.index,
        });
        await toast.promise(res, {
            loading: 'Updating order of todo items',
            error: 'Oops something wrong happened',
            success: 'Updated order of item',
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
                        <DragDropContext onDragEnd={handleDragEndTodoItem}>
                            <Droppable droppableId="todo-list">
                                {(props) => (
                                    <div
                                        className="todo-list"
                                        {...props.droppableProps}
                                        ref={props.innerRef}
                                    >
                                        {todoList.map(
                                            (
                                                item: ITodoItem,
                                                index: number,
                                            ) => {
                                                return (
                                                    <Draggable
                                                        key={item.id}
                                                        draggableId={item.id}
                                                        index={index}
                                                    >
                                                        {(props) => (
                                                            <div
                                                                {...props.draggableProps}
                                                                ref={
                                                                    props.innerRef
                                                                }
                                                                {...props.dragHandleProps}
                                                            >
                                                                <TodoItem
                                                                    {...item}
                                                                    handleDeleteItem={
                                                                        deleteItemHandler
                                                                    }
                                                                    handleUpdateItem={
                                                                        updateItemHandler
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            },
                                        )}
                                        {props.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                </div>
                <TodoCreatorFields setTodoList={setTodoList} />
            </div>
        </TodoEditorContext.Provider>
    );
}
