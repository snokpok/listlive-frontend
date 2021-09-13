import axios from 'axios';
import { serverConfigs } from '../configs';

export const axiosReqGetTodoList = (token: string | null) => {
    const axiosReq = axios({
        method: 'get',
        url: `${serverConfigs.backend_dev}/todos`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return axiosReq;
};

interface ITodoInputFields {
    title: string;
    description: string;
}
export const axiosReqCreateTodo = (
    token: string | null,
    todoInputFields: ITodoInputFields,
) => {
    const axiosReq = axios({
        method: 'post',
        url: `${serverConfigs.backend_dev}/todo`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: todoInputFields,
    });
    return axiosReq;
};

export const axiosReqDeleteTodo = (token: string | null, id: string) => {
    const axiosReq = axios({
        method: 'delete',
        url: `${serverConfigs.backend_dev}/todo?id=${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return axiosReq;
};

export const axiosReqEditTodo = (
    token: string | null,
    id: string,
    todoInputFields: ITodoInputFields,
) => {
    const axiosReq = axios({
        method: 'put',
        url: `${serverConfigs.backend_dev}/todo?id=${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: todoInputFields,
    });
    return axiosReq;
};

interface EditTodoOrder {
    itemId: string;
    newOrder: number;
}

export const axiosReqEditTodoOrder = (
    token: string | null,
    body: EditTodoOrder,
) => {
    const axiosReq = axios({
        method: 'put',
        url: `${serverConfigs.backend_dev}/todo/change-order`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            item_id: body.itemId,
            new_order: body.newOrder,
        },
    });
    return axiosReq;
};

export const axiosReqDecodeToken = (token: string | null) => {
    return axios({
        method: 'get',
        url: `${serverConfigs.backend_dev}/decode-token?token=${token}`,
    });
};
