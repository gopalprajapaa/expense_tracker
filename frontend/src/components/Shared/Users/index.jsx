import { DeleteOutlined, EditOutlined, EyeInvisibleFilled, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Table } from "antd";
//import Item from "antd/es/list/Item";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import http from "../../../utils/http.js";
import useSWR, { mutate } from "swr";
import fetcher from "../../../utils/fetcher.js";
import { formatDate } from "../../../utils/date.js";



const { Item } = Form;

const Users = () => {

    const [transactionForm] = Form.useForm();


    const [edit, setEdit] = useState(null)
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([]);
    const [no, setNo] = useState(0)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    });



    const columns = [
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            className: "capitalize"
        },
        {
            title: "Fullname",
            dataIndex: "fullname",
            key: "fullname",
            className: "capitalize"
        },
        {
            title: "Moblie",
            dataIndex: "mobile",
            key: "mobile",
            className: "capitalize"
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            className: "capitalize"
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => formatDate(date)
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            className: "capitalize",
            render: (status, obj) => (
                status ?
                    <Button
                        shape="circle"
                        icon={<EyeOutlined />}
                        className="!bg-green-500 !text-white"
                        onClick={() => onStatus(obj)}
                        loading={loading}
                    /> :
                    <Button
                        shape="circle"
                        icon={<EyeInvisibleFilled />}
                        className="!bg-rose-400 !text-white"
                        onClick={() => onStatus(obj)}
                        loading={loading}
                    />
            )
        },
    ]



    // const { data: users, error, isLoading } = useSWR(
    //     "api/user/get",
    //     fetcher
    // )


    const fetchUsers = async (page = 1, pageSize = 5) => {
        try {
            setLoading(true);
            const res = await http.get(`/api/user/get?page=${page}&limit=${pageSize}`);
            const { data, total } = res.data;
            setUsers(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total
            })

        } catch (error) {
            toast.error("Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers(
            pagination.current, 
            pagination.pageSize
        );
    }, [no])


    const onStatus = async (obj) => {
        try {
            setLoading(true);
            await http.put(`/api/user/status/${obj._id}`, { status: !obj.status });
            toast.success("Status updated SuccessFully !");
            setNo(no+1);
            //  setModel(false);
            //  transactionForm.resetFields();
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleTableChange = (pagination) => {
        fetchUsers(pagination.current, pagination.pageSize);
    };

    return (
        <div>
            <div className="grid">
                <Card title="Transaction List" style={{ overflowX: "auto" }}
                    extra={
                        <div className="mt-2 md:mt-0 flex flex-col md:flex-row gap-3">
                            <Input
                                placeholder="Search By All"
                                prefix={<SearchOutlined />}
                            />

                        </div>
                    }
                >

                    <Table
                        columns={columns}
                        dataSource={users}
                        scroll={{ x: "max-content" }}
                        loading={loading}
                        rowKey="_id"
                        onChange={handleTableChange}
                        pagination={pagination}
                    />
                </Card>
            </div>
        </div>
    )
}

export default Users;