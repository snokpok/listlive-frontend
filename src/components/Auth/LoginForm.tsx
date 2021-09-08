import { serverConfigs } from '@/common/configs';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { UserContext } from '@/common/contexts/user.context';

export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .required('Please enter your email')
        .email('Must be a valid email'),
    password: Yup.string().required('Please enter your password'),
});

function LoginForm() {
    const router = useRouter();
    const userContext = React.useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: async (values, actions) => {
            const response = await toast.promise(
                axios({
                    url: `${serverConfigs.backend_dev}/login`,
                    method: 'post',
                    data: values,
                }),
                {
                    loading: 'Logging you in...',
                    success: 'Successfully logged in',
                    error: 'Incorrect credentials',
                },
                {
                    position: 'bottom-left',
                },
            );
            if (response.data) {
                document.cookie = `t=${response.data.token}; path=/`;
                userContext.setUser({
                    token: response.data.token,
                    id: response.data.id,
                });
                router.replace('/app');
            }
            actions.setSubmitting(false);
        },
    });

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col space-y-2 items-center shadow-2xl w-96 p-8 rounded-lg"
        >
            <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={formik.handleChange}
                className={`w-10/12`}
            />
            <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={formik.handleChange}
                className="w-10/12"
            />
            <button
                type="submit"
                className="bg-black text-white w-16 p-3 rounded-lg hover:opacity-80 transition"
            >
                Login
            </button>
        </form>
    );
}

export default LoginForm;
