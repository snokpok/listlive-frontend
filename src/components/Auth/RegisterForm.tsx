import { serverConfigs } from '@/common/configs';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

export const registerSchema = Yup.object().shape({
    email: Yup.string()
        .required('Please enter your email')
        .email('Must be a valid email'),
    password: Yup.string().required('Please enter your password'),
});

export default function RegisterForm() {
    const router = useRouter();
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        },
        validationSchema: registerSchema,
        onSubmit: async (values, actions) => {
            const response = await toast.promise(
                axios({
                    url: `${serverConfigs.backend_dev}/user`,
                    method: 'post',
                    data: {
                        email: values.email,
                        password: values.password,
                        first_name: values.firstName,
                        last_name: values.lastName,
                    },
                }),
                {
                    loading: 'Creating your account...',
                    success: 'Successfully created account',
                    error: 'Oops something went wrong',
                },
                {
                    position: 'bottom-left',
                },
            );
            if (response.data.token) {
                document.cookie = `t=${response.data.token}; path=/`;
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
                placeholder="First name"
                name="firstName"
                onChange={formik.handleChange}
                className={`w-10/12`}
            />
            <input
                placeholder="Last name"
                name="lastName"
                onChange={formik.handleChange}
                className="w-10/12"
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
                Register
            </button>
        </form>
    );
}
