import { Button, Card, Form, Input } from 'antd'
import { LockOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"
import Homelayout from '../../../layout/Homelayout';
import { useState } from 'react';
import { toast } from 'react-toastify';
import http from '../../../utils/http';

const { Item } = Form;
const Signup = () => {

    const [signupForm]=Form.useForm();

    const [formData, setFormData] = useState(null);
    const [otp, setOtp] = useState(null);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const { data } = await http.post("/api/user/send-mail", values);
            setOtp(data.otp);
            setFormData(values);
        } catch (error) {
            toast.error(error.response ? error.response.data.message: error.message)
            setOtp(null)
            setFormData(null);
        } finally {
            setLoading(false);
        }
    }


     const onSignup = async (values) => {
        try {
            if(Number(values.otp)!==Number(otp) )
            {
               return toast.error("Invalid otp");
            }
            setLoading(true);
            await http.post("/api/user/signup", formData);
            toast.success("Signup Success");
            setOtp(null)
            setFormData(null);
            signupForm.resetFields();
        } catch (error) {
            toast.error(error.response ? error.response.data.message: error.message)
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
                            Register To Track Your Progress
                        </h2>
                        {
                            otp ?
                                <Form name="otp-form" layout="vertical" onFinish={onSignup} >
                                    <Item
                                        name="otp"
                                        label="OTP"
                                        rules={[{ required: true }]}
                                    >
                                        <Input.OTP
                                            prefix={<UserOutlined />}
                                            placeholder="Enter your fullname"
                                        />
                                    </Item>
                                    <Item>
                                        <Button
                                            loading={loading}
                                            type='text'
                                            htmlType='submit'
                                            className='!bg-[#FF735C] !text-white !font-bold'
                                            block
                                        >
                                            Verify Now 
                                        </Button>
                                    </Item>
                                </Form> :
                                <Form name="signup-form" layout="vertical" onFinish={onFinish} form={signupForm}>
                                    <Item
                                        name="fullname"
                                        label="Fullname"
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Enter your fullname"
                                        />
                                    </Item>
                                    <Item
                                        name="mobile"
                                        label="Mobile"
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            prefix={<PhoneOutlined />}
                                            placeholder="Enter your mobile number"
                                        />
                                    </Item>
                                    <Item
                                        name="email"
                                        label="Username"
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Enter your username"
                                        />
                                    </Item>
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
                                    <Item>
                                        <Button
                                            loading={loading}
                                            type='text'
                                            htmlType='submit'
                                            className='!bg-[#FF735C] !text-white !font-bold'
                                            block
                                        >
                                            Signup
                                        </Button>
                                    </Item>
                                </Form>
                        }
                        <div className="flex items-center justify-between mt-4">
                            <div></div>
                            <Link
                                style={{ textDecoration: "underline" }}
                                to="/"
                                className="!text-[#FF735C] !font-bold"
                            >
                                Already have an account?
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </Homelayout>
    );
}

export default Signup;