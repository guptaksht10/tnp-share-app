"use client"

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Navbar from "@/components/navbar";
import { getStudentsData } from "@/lib/api";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CircularProgress from '@mui/material/CircularProgress';

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const shareToken = searchParams.get("shareToken");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [Error, setError] = useState('');

    useEffect( () => {
       async function fetchData() {
           if (!shareToken) {
               setError("No share token provided");
               alert("No share token provided");
               return;
           }
           setLoading(true);
           const result : any = await getStudentsData(shareToken);
           if (result.success) {
               setData(result.studentData);
               setLoading(false);
               return;
           }
           setLoading(false);
           if(data.length === 0) {
               setError("Check if the share Token is valid or expired");
               alert("Check if the share Token is valid or expired");
           }
       }
       fetchData();
    }, [shareToken]);
    return (
        <>
        <Navbar />
        {loading && (
            <div className="flex justify-center items-center mt-8">
                <CircularProgress />
            </div>
        )}
        <div className="flex justify-center items-center mt-8">
                        <Paper elevation={4} sx={{ padding: 4, width: '80%', borderRadius: 2 }}>
                            <div className="flex justify-between items-center mb-4">
                                <Typography variant="h6">Student Details</Typography>
                            </div>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>First Name</strong></TableCell>
                                            <TableCell><strong>Last Name</strong></TableCell>
                                            <TableCell><strong>Roll No</strong></TableCell>
                                            <TableCell><strong>Email</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                            {!loading && data.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} align="center">
                                                        No data available
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {data && data.map((item: any) => (
                                                <TableRow key={item.roll_no}>
                                                    <TableCell>{item.first_name}</TableCell>
                                                    <TableCell>{item.last_name}</TableCell>
                                                    <TableCell>{item.roll_no}</TableCell>
                                                    <TableCell>{item.email}</TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </div>
        </>
    )
}
