import TodoEditorContext from '@/common/contexts/todo-editor.context';
import React from 'react';
import { ReactElement } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import EditTodoWidget from './EditTodoWidget';
import TodoEditFields, { TodoItemProps } from './TodoEditFields';

export default function TodoItem({
    id,
    title,
    description,
    handleDeleteItem,
    handleUpdateItem,
}: TodoItemProps): ReactElement | null {
    const todoEditorContext = React.useContext(TodoEditorContext);

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
            className="group flex border-opacity-20 border-b-2 border-black p-3 justify-between"
            key={id}
        >
            <div className="flex flex-col">
                <div className="font-semibold">{title}</div>
                <div className="text-sm text-gray-500">{description}</div>
            </div>
            <div className="flex flex-col justify-self-end space-y-1">
                <AiFillCloseCircle
                    className="hover:text-red-500 transition-colors text-lg cursor-pointer"
                    onClick={() => handleDeleteItem(id)}
                />
                <EditTodoWidget id={id} />
            </div>
        </div>
    );
}
