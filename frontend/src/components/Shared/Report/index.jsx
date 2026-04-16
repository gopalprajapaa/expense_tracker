import { useEffect, useState } from "react";
import http from "../../../utils/http";
import Loader from "../Loader";
import DailyTransactionChart from "../DailyTransactions";
import { Card } from "antd";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Report=()=>{
    const [report, setReport] = useState(null);

    useEffect(()=>{
        http.get("/api/dashboard/report")
       .then((res)=>setReport(res.data))
       .catch(console.error);

    },[]);
    
    if(!report) return <Loader/>

    const { summary, chart } = report;

    const pieData = [
        { name: 'Credit', value: summary.totalCredit },
        { name: 'Debit', value: summary.totalDebit }
    ];
    const COLORS = ['#22c55e', '#f97316'];

    return (
        <div className="bg-white p-2 rounded">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Welcome to Report Dashboard</h1>
            </div>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
                <Card className="shadow-sm border-l-4 border-l-rose-500 text-center">
                    <h2 className="text-gray-500">Total Transactions</h2>
                    <p className="text-2xl font-bold text-rose-500">{summary.totalTransaction}</p>
                </Card>
                <Card className="shadow-sm border-l-4 border-l-green-500 text-center">
                    <h2 className="text-gray-500">Total Credit</h2>
                    <p className="text-2xl font-bold text-green-500">{summary.totalCredit}₹</p>
                </Card>
                <Card className="shadow-sm border-l-4 border-l-orange-500 text-center">
                    <h2 className="text-gray-500">Total Debit</h2>
                    <p className="text-2xl font-bold text-orange-500">{summary.totalDebit}₹</p>
                </Card>
                <Card className="shadow-sm border-l-4 border-l-indigo-500 text-center">
                    <h2 className="text-gray-500">Balance</h2>
                    <p className="text-2xl font-bold text-indigo-500">{summary.balance}₹</p>
                </Card>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-4 mb-6">
                <Card title="Credit vs Debit Breakdown" className="shadow-sm border-t-4 border-t-purple-500">
                    <div className="w-full h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value}₹`} />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Daily Transaction Totals" className="shadow-sm border-t-4 border-t-blue-500">
                    <div className="w-full h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chart}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{fontSize: 12}} />
                                <YAxis tick={{fontSize: 12}} />
                                <Tooltip cursor={{fill: 'transparent'}} formatter={(value) => `${value}₹`} />
                                <Legend />
                                <Bar dataKey="total" fill="#3b82f6" name="Total Amount (₹)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="mt-5 grid md:grid-cols-1"> 
                <DailyTransactionChart transactions={chart}/>
            </div>
        </div>
    )
}

export default Report;