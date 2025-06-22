"use client"

import { useState, useEffect } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress } from "@mui/material";
import Navbar from "@/components/navbar";
import { getStudentsData } from "@/lib/api";
import { StudentDataResponse, studentDetails } from "@/types/api";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Button from "@mui/material/Button";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export default function Page() {
    const params = useParams();
    const shareToken = Array.isArray(params.shareToken) ? params.shareToken[0] : params.shareToken;
    
    const [data, setData] = useState<studentDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchData() {
            if (!shareToken) {
                setError("No share token provided");
                alert("No share token provided");
                return;
            }

            setLoading(true);
            const result: StudentDataResponse = await getStudentsData(shareToken);

            if (result.success) {
                setData(result.studentData || []);
            } else {
                setError("Check if the share token is valid or expired");
                console.log("Check if the share token is valid or expired");
            }
            console.log(error);

            setLoading(false);
        }

        fetchData();
    }, [shareToken]);

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Student Details", 14, 16);

        const tableData = data.map((student) => [
            student.first_name,
            student.last_name,
            student.roll_no,
            student.email,
        ]);

        autoTable(doc, {
            head: [["First Name", "Last Name", "Roll No", "Email"]],
            body: tableData,
            startY: 20,
        });

        const suffix = shareToken?.slice(-2) || "00";
        doc.save(`student-details-${suffix}.pdf`);
    };

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
                        {data.length > 0 && (
                           <Button
                           onClick={handleDownloadPDF}
                           variant="outlined"
                           startIcon={<PictureAsPdfIcon />}
                           sx={{
                               borderColor: 'red',
                               color: 'red',
                               '&:hover': {
                                   borderColor: 'darkred',
                                   backgroundColor: '#ffe5e5',
                               },
                               textTransform: 'none'
                           }}
                       >
                           Download PDF
                       </Button>
                        )}
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
                                {data.map((item) => (
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
    );
}
