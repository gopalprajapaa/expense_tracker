import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Table } from "antd";
//import Item from "antd/es/list/Item";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import http from "../../../utils/http.js";
import useSWR, { mutate } from "swr";
import fetcher from "../../../utils/fetcher.js";
import { formatDate } from "../../../utils/date.js";



const { Item } = Form;

const Transactions = () => {

    const [transactionForm] = Form.useForm();


    const [edit, setEdit] = useState(null)
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [transactions, setTransactions] = useState([]);
    const [no, setNo] = useState(0)
    const [pagination, setPagination] = useState({
        current:1,
        pageSize:5,
        total:0
    });



    const columns = [
        {
            title: "Transaction Type",
            dataIndex: "transactionType",
            key: "transactionType",
            className: "capitalize"
        },
        {
            title: "Mobile",
            dataIndex: "mobile",
            key: "mobile",
            className: "capitalize"
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            className: "capitalize"
        },
        {
            title: "Payment Method",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            className: "capitalize"
        },
        {
            title: "Notes",
            dataIndex: "notes",
            key: "notes",
            className: "capitalize"
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date)=>formatDate(date)
        },
        {
            title: "Action",
            key: "action",
            fixed: "right",
            render: (_, obj) => (
                <div className="flex gap-1">
                    <Popconfirm
                        title="Are you Sure ?"
                        description="Once you update, you can also re-update !"
                        onCancel={() => toast.info("No changes occur !")}
                        onConfirm={()=> onEditTransaction(obj)}

                    >
                        <Button
                            type="text"
                            className="!bg-green-100 !text-green-500"
                            icon={<EditOutlined />}

                        />
                    </Popconfirm>
                    <Popconfirm
                        title="Are you Sure ?"
                        description="Once you deleted, you can not re-store !"
                        onCancel={() => toast.info("your data is safe !")}
                        onConfirm={()=>onDelete(obj._id)}
                    >

                        <Button
                            type="text"
                            className="!bg-rose-100 !text-rose-500"
                            icon={<DeleteOutlined />}

                        />

                    </Popconfirm>

                </div>
            )

        }
    ]



    // const {data:transactions,error,isLoading}=useSWR(
    //     "/api/transaction/get",
    //     fetcher
    // )


    const fetchTransaction=async(page=1,pageSize=5)=>{
        try{
            setLoading(true);
            const res=await http.get(`/api/transaction/get?page=${page}&limit=${pageSize}`);
            const {data,total}=res.data;
            setTransactions(data);
            setPagination({
                current:page,
                pageSize:pageSize,
                total:total
            })

        }catch(error){
            toast.error("Failed to fetch transactions");
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
         fetchTransaction(
            pagination.current,
            pagination.pageSize
         ); 
    },[no])

    const onFinish=async(values)=>{
        try{
             setLoading(true);
             await http.post("api/transaction/create",values);
             toast.success("Transaction createdly SuccessFully !");
             setNo(no+1);
             setModal(false);
             transactionForm.resetFields();
        }catch(error){
            toast.error(error?.response?.data?.message || error.message);
        }finally{
            setLoading(false);
        }
    }

     const onUpdate=async(values)=>{
        try{
             setLoading(true);
             await http.put(`api/transaction/update/${edit._id}`,values);
             toast.success("Transaction updated SuccessFully !");
             setNo(no+1);  
             setModal(false);
             setEdit(null); 
             transactionForm.resetFields();
        }catch(error){
            toast.error(error?.response?.data?.message || error.message);
        }finally{
            setLoading(false);
        }
    }

    const onDelete=async(id)=>{
          try{
             setLoading(true);
             await http.delete(`api/transaction/delete/${id}`);
             toast.success("Transaction deleted SuccessFully !");
             setNo(no+1);
            //  setModel(false);
            //  transactionForm.resetFields();
        }catch(error){
            toast.error(err?.response?.data?.message || error.message);
        }finally{
            setLoading(false);
        }
    }

    const onEditTransaction=(obj)=>{
        setEdit(obj);
        transactionForm.setFieldsValue(obj);
        setModal(true);
    }


    const handleTableChange=(pagination)=>{
        fetchTransaction(pagination.current,pagination.pageSize);
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
                            <Button
                                type="text"
                                className="!font-bold !bg-blue-500 !text-white"
                                onClick={() => setModal(true)}
                            >
                                Add new transaction
                            </Button>

                        </div>
                    }
                >

                    <Table
                        columns={columns}
                        dataSource={transactions}
                        scroll={{ x: "max-content" }}
                        loading={loading}
                        rowKey="_id"
                        pagination={pagination}
                        onChange={handleTableChange}
                    />
                </Card>
            </div>
            <Modal
                open={modal}
                onCancel={() => {
                    setModal(false)
                    setEdit(null)
                    transactionForm.resetFields()
                }}
                title="Add new transaction"
                footer={null}
            >
                <Form
                    layout="vertical"
                    form={transactionForm}
                    onFinish={edit ? onUpdate:onFinish}
                >
                    <div className="grid md:grid-cols-2 gap-x-3 ">
                        <Item
                            label="Transaction"
                            name="transactionType"
                            rules={[{ required: true }]}
                        >
                            <Select
                                placeholder=" Transaction Type"
                                options={[
                                    { label: "CR", value: "cr" },
                                    { label: "DR", value: "dr" },
                                ]}

                            />
                        </Item>
                        <Item
                            label="Amount"
                            name="amount"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Enter Amount" type="number" />
                        </Item>
                        <Item
                            label="Title"
                            name="title"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Enter Title" />
                        </Item>
                        <Item
                            label="Payment Method"
                            name="paymentMethod"
                            rules={[{ required: true }]}
                        >
                            <Select
                                placeholder="Payment Method"
                                options={[
                                    { label: "Cash", value: "cash" },
                                    { label: "Online", value: "online" },
                                ]}

                            />
                        </Item>

                    </div>
                    <Item
                        label="Notes"
                        name="notes"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea placeholder="potato,tomato,etc" />
                    </Item>
                    <Item
                    className="flex justify-end items-center"
                    >
                        <Button
                            loading={loading}
                            type="text"
                            htmlType="Submit"
                            className={`!font-semibold !text-white ${edit ? "!bg-red-500": "!bg-blue-500"}`}
                        >
                            {edit?"Update":"Submit"}
                        </Button>
                    </Item>

                </Form>

            </Modal>
        </div>
    )
}

export default Transactions;