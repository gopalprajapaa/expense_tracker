import { AppstoreAddOutlined, BarChartOutlined, DollarCircleOutlined, LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, Image, Layout, Menu, theme } from "antd";
import { useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";
import fetcher from "../../../utils/fetcher.js";
import Loader from "../../Shared/Loader";
import { toast } from "react-toastify";
import http from "../../../utils/http";

const { Sider, Header, Content, Footer } = Layout;


const items = [
    {
        key: "/app/user/dashboard",
        label: "Dashboard",
        icon: <AppstoreAddOutlined />
    },
    {
        key: "/app/user/report",
        label: "Reports",
        icon: <BarChartOutlined />
    },
    {
        key: "/app/user/transactions",
        label: "Transactions",
        icon: <DollarCircleOutlined />
    },
];


const Userlayout = () => {

    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleNavigate = (menu) => {
        navigate(menu.key);
    }





    const siderStyle = {
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable',
    };

    const headerStyle = {
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: 0,
    };


    //logout
    const logout = async () => {
        try {
            setLoading(true);
            await http.get("/api/user/logout")
            navigate("/")
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error(error.response ? error.response.data.message : error.message)
        }
    }


    const { token: colorBgContainer, borderRadiusLG } = theme.useToken();


    return (
        <Layout className="!min-h-screen">
            <Sider style={siderStyle} collapsible collapsed={open}>
                <div className="flex items-center justify-center my-4">
                    <Image
                        src="/exp-img.jpg"
                        width={60}
                        height={60}
                        alt="logo"
                        className="rounded-full !text-center !mx-auto mb-3"
                    />
                </div>
                <Menu
                    defaultSelectedKeys={[pathname]}
                    theme="dark"
                    items={items}
                    onClick={handleNavigate}
                />
            </Sider>
            <Layout>
                <Header style={headerStyle} className="flex items-center justify-between !px-5 !bg-white !shadow">
                    <Button
                        onClick={() => setOpen(!open)}
                        icon={<MenuOutlined />}
                    />
                    <Button
                        icon={<LogoutOutlined />}
                        onClick={logout}
                        loading={loading}
                    />
                </Header>
                <Content
                    style={{
                        margin: '4px 8px',
                        padding: 4,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
                <Footer className="relative overflow-hidden mt-6 px-6 py-8 bg-white border-t border-gray-100 print:hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 via-orange-400 to-rose-400 opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 pointer-events-none"></div>
                    
                    <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Brand Section */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 shadow-lg shadow-rose-200 transform transition-all duration-300 hover:scale-105 hover:rotate-3">
                                <DollarCircleOutlined className="text-white text-2xl" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
                                    Expense Tracker
                                </span>
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-0.5">
                                    Smart Financial Management
                                </span>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="flex flex-col items-center">
                            <p className="text-sm text-gray-500 font-medium m-0">
                                &copy; {new Date().getFullYear()} All rights reserved.
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 opacity-75"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 opacity-50"></span>
                            </div>
                        </div>

                        {/* Links Section */}
                        <div className="flex items-center space-x-6">
                            <a href="#" className="group flex items-center space-x-2 text-sm font-semibold text-gray-500 hover:text-rose-500 transition-colors duration-300">
                                <span className="relative overflow-hidden">
                                    <span className="block transition-transform duration-300 group-hover:-translate-y-full">Support</span>
                                    <span className="absolute inset-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">Support</span>
                                </span>
                            </a>
                            <a href="#" className="group flex items-center space-x-2 text-sm font-semibold text-gray-500 hover:text-rose-500 transition-colors duration-300">
                                <span className="relative overflow-hidden">
                                    <span className="block transition-transform duration-300 group-hover:-translate-y-full">Privacy</span>
                                    <span className="absolute inset-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">Privacy</span>
                                </span>
                            </a>
                        </div>
                    </div>
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Userlayout;