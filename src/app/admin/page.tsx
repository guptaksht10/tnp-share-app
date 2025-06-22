"use client";

import { useState, useEffect } from "react";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from "@/components/navbar";
import CheckIcon from '@mui/icons-material/Check';
import { getShareToken } from "@/lib/api";
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [shareToken, setShareToken] = useState('');
    const [shareUrl, setShareUrl] = useState('');
    const [copiedField, setCopiedField] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loginStatus = localStorage.getItem("isLoggedIn");
        setIsLoggedIn(loginStatus === "true");
    
        if (!isLoggedIn) {
          router.push("/sign-in");
          alert("Not a authorized user");
          return;
        }
    }, [router]);

    const handleGenerateShareToken = async () => {
        setOpenModal(false);
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken") || "";
        const result : any = await getShareToken(accessToken);
        if (result.success) {
            const shareToken = result.shareToken;
            const shareUrl = `http://localhost:3000/public-path?shareToken=${shareToken}`;

            setShareToken(shareToken);
            setShareUrl(shareUrl);
            setOpenModal(true);

            setLoading(false);
            return;
        }
        setLoading(false);
        alert(result.error);
        if(result.error === 'Invalid credentials') {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            router.push("/sign-in");
        }
    }

    const handleCopy = (text: string, type: 'token' | 'url') => {
        navigator.clipboard.writeText(text);
        setCopiedField(type);
        setTimeout(() => setCopiedField(''), 2000); 
      };

    return (
        <div>
            <Navbar />
            <div className="flex flex-col gap-4">
                <Typography variant="h4" className="text-blue-500 p-8 font-bold">
                    Admin Dashboard
                </Typography>

                <div className="px-8">
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: 'darkgreen',
                            '&:hover': {
                                backgroundColor: '#065f46',
                            },
                        }}
                        onClick={() => {handleGenerateShareToken()}}
                    >
                        Generate Share Token
                    </Button>
                </div>
                {loading && (
                    <div className="flex justify-center items-center mt-8">
                        <CircularProgress />
                    </div>
                )}
                {openModal && (
                    <div className="flex justify-center items-center mt-8">
                        <Paper elevation={4} sx={{ padding: 4, width: '80%', borderRadius: 2 }}>
                            <div className="flex justify-between items-center mb-4">
                                <Typography variant="h6">Generated Tokens</Typography>
                                <IconButton onClick={() => setOpenModal(false)}>
                                    <CloseIcon />
                                </IconButton>
                            </div>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Value</strong></TableCell>
                                            <TableCell><strong>Action</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                            <div className="text-blue-600 text-sm">
                                                Share Token:  
                                                <span className="p-8 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                                                    {shareToken}
                                                </span>
                                            </div>
                                            </TableCell>
                                            <TableCell>
                                            <IconButton onClick={() => handleCopy(shareToken, 'token')} color="primary">
                                                {copiedField === 'token' ? <CheckIcon color="success" /> : <ContentCopyIcon />}
                                            </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                            <div className="text-blue-600 text-sm">
                                                Share URL: 
                                                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                                                    {shareUrl}
                                                </span>
                                            </div>
                                            </TableCell>
                                            <TableCell>
                                            <IconButton onClick={() => handleCopy(shareUrl, 'url')} color="primary">
                                                {copiedField === 'url' ? <CheckIcon color="success" /> : <ContentCopyIcon />}
                                            </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        </TableBody>

                                </Table>
                            </TableContainer>
                        </Paper>
                    </div>
                )}
            </div>
        </div>
    );
}
