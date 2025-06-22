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
import { ShareTokenResponse } from "@/types/api";

interface AdminPageState {
    openModal: boolean;
    shareToken: string;
    shareUrl: string;
    copiedField: 'token' | 'url' | '';
    loading: boolean;
    isLoggedIn: boolean;
}

export default function AdminPage() {
    const router = useRouter();

    const [state, setState] = useState<AdminPageState>({
        openModal: false,
        shareToken: '',
        shareUrl: '',
        copiedField: '',
        loading: true,
        isLoggedIn: false
    });
    const [pageLoading, setPageLoading] = useState(false);

    useEffect(() => {
        const loginStatus = localStorage.getItem("isLoggedIn");
        setState(prev => ({ ...prev, isLoggedIn: loginStatus === "true" }));
    
        if (!loginStatus || loginStatus !== "true") {
            router.push("/sign-in");
            alert("Not a authorized user");
            setState(prev => ({ ...prev, loading: false }));
            setPageLoading(false);
            return;
        }
        setState(prev => ({ ...prev, loading: false }));
        setPageLoading(false);
    }, []);

    const handleGenerateShareToken = async (): Promise<void> => {
        setState(prev => ({ ...prev, openModal: false, loading: true }));
        const accessToken = localStorage.getItem("accessToken") || "";
        const result: ShareTokenResponse = await getShareToken(accessToken);

        if (result.success) {
            const shareToken = result.shareToken;
            const shareUrl = `https://tnp-share-app-llb8.vercel.app/public-path/${shareToken}`;

            setState(prev => ({ 
                ...prev,
                shareToken: shareToken!,
                shareUrl,
                openModal: true,
                loading: false
            }));
            return;
        }

        setState(prev => ({ ...prev, loading: false }));
        alert(result.error);
        if (result.error === 'Invalid credentials') {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            alert('Please login again!')
            router.push("/sign-in");
        }
    };

    const handleCopy = (text: string, type: 'token' | 'url'): void => {
        navigator.clipboard.writeText(text);
        setState(prev => ({ ...prev, copiedField: type }));
        setTimeout(() => setState(prev => ({ ...prev, copiedField: '' })), 2000);
    };

    return (
        <>{pageLoading ? (
            <div className="flex justify-center items-center mt-8">
                <CircularProgress />
            </div>
        ) : (state.isLoggedIn ? <div>
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
              {state.loading && (
                  <div className="flex justify-center items-center mt-8">
                      <CircularProgress />
                  </div>
              )}
              {state.openModal && (
                  <div className="flex justify-center items-center mt-8">
                      <Paper elevation={4} sx={{ padding: 4, width: '80%', borderRadius: 2 }}>
                          <div className="flex justify-between items-center mb-4">
                              <Typography variant="h6">Generated Tokens</Typography>
                              <IconButton onClick={() => setState(prev => ({ ...prev, openModal: false }))}>
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
                                                  {state.shareToken}
                                              </span>
                                              </div>
                                          </TableCell>
                                          <TableCell>
                                          <IconButton onClick={() => handleCopy(state.shareToken, 'token')} color="primary">
                                              {state.copiedField === 'token' ? <CheckIcon color="success" /> : <ContentCopyIcon />}
                                                  </IconButton>
                                          </TableCell>
                                      </TableRow>
                                      <TableRow>
                                          <TableCell>
                                          <div className="text-blue-600 text-sm">
                                              Share URL: 
                                              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                                                  {state.shareUrl}
                                              </span>
                                          </div>
                                          </TableCell>
                                          <TableCell>
                                          <IconButton onClick={() => handleCopy(state.shareUrl, 'url')} color="primary">
                                              {state.copiedField === 'url' ? <CheckIcon color="success" /> : <ContentCopyIcon />}
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
      </div> : (<div>
        <Navbar />
        <div className="flex justify-center items-center mt-8">
            <CircularProgress />
        </div>
      </div> ))}</>
    );
}
