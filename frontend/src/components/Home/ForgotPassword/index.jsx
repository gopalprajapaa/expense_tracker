import { Button, Card, Form, Input } from 'antd'
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Homelayout from '../../../layout/Homelayout';
import http from '../../../utils/http';

const { Item } = Form;
const ForgotPassword = () => {

    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { forgotForm } = Form.useForm();
    const { rePasswordForm } = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const tok = params.get("token");
        if (tok) {
            checkToken(tok);
        } else {
            setToken(null);
        }
    }, [params.toString()]);



    const checkToken = async (tok) => {
        try {
            await http.post("/api/user/verify-token", {}, {
                headers: {
                    Authorization: `Bearer ${tok}`
                }
            });
            setToken(tok);

        } catch (error) {
            setToken(null);
        }
    }

    const onFinish = async (values) => {
        try {
            setLoading(true);
            await http.post("/api/user/forgot-password", values);
            toast.success("Please check your email to forgot password");
        } catch (error) {
            toast.error(error.response ? error.response.data.message : error.message);
        } finally {
            setLoading(false);
        }
    }



    const onChangePassword = async (values) => {
        try {
            if(values.password!==values.rePassword)
                return toast.warning("Password and rePassword are mismatched");
            setLoading(true);
            await http.put("/api/user/change-password", values, {
                headers: {
                    Authorization: `Bearer ${params.get("token")}`
                }
            }
            );
            toast.success("Password updated Successfully, Please wait....!");
            setTimeout(()=>
            {
               navigate("/")
            },3000);
        } catch (error) {
            toast.error(error.response ? error.response.data.message : error.message);
        } finally {
            setLoading(false);
        }
    }


    return (
        <Homelayout>
            <div className="flex">
                {/* Left Image Section */}
                <div className="w-1/2 hidden md:flex items-center justify-center">
                    <img
                        src="/exp-img.jpg"
                        alt="Bank"
                        className="w-4/5 object-contain"
                    />
                </div>

                {/* Right Login Card Section */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-2 md:p-6 bg-white">
                    <Card className="w-full max-w-sm shadow-xl">
                        <h2 className="font-bold text-[#FF735C] text-2xl text-center mb-6">
                            {
                                token ?
                                    "Change Password"
                                    :
                                    "Forgot Password"
                            }
                        </h2>
                        {
                            token ?
                                <Form name="login-form" layout="vertical" onFinish={onChangePassword} form={rePasswordForm}>
                                    <Item
                                        name="password"
                                        label="Password"
                                        rules={[{ required: true }]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined />}
                                            placeholder="Enter your Password"
                                        />
                                    </Item>
                                    <Item
                                        name="rePassword"
                                        label="Re Enter Password"
                                        rules={[{ required: true }]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined />}
                                            placeholder="Enter your Password"
                                        />
                                    </Item>
                                    <Item>
                                        <Button
                                            type='text'
                                            htmlType='submit'
                                            className='!bg-[#FF735C] !text-white !font-bold'
                                            loading={loading}
                                            block
                                        >
                                            Change Password
                                        </Button>
                                    </Item>
                                </Form>
                                :
                                <Form name="login-form" layout="vertical" onFinish={onFinish} form={forgotForm}>
                                    <Item
                                        name="email"
                                        label="Email"
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Enter your email"
                                        />
                                    </Item>
                                    <Item>
                                        <Button
                                            type='text'
                                            htmlType='submit'
                                            className='!bg-[#FF735C] !text-white !font-bold'
                                            loading={loading}
                                            block
                                        >
                                            Submit
                                        </Button>
                                    </Item>
                                </Form>
                        }
                        <div className="flex items-center justify-between mt-4">
                            <Link
                                style={{ textDecoration: "underline" }}
                                to="/"
                                className="!text-[#FF735C] !font-bold"
                            >
                                Sign in
                            </Link>
                            <Link
                                style={{ textDecoration: "underline" }}
                                to="/signup"
                                className="!text-[#FF735C] !font-bold"
                            >
                                Don't have an account?
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </Homelayout>
    );
}

export default ForgotPassword;