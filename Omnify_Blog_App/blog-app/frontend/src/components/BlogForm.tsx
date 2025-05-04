import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper,
} from '@mui/material';
import { blogService } from '../services/api';
import { Blog } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';

interface BlogFormProps {
    isEdit?: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({ isEdit = false }) => {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(isEdit);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (isEdit && id) {
            const fetchBlog = async () => {
                try {
                    const blog = await blogService.getBlogById(parseInt(id));
                    setTitle(blog.title);
                    setContent(blog.content);
                } catch (error) {
                    console.error('Error fetching blog:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchBlog();
        }
    }, [isEdit, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEdit && id) {
                await blogService.updateBlog(parseInt(id), { title, content });
            } else {
                await blogService.createBlog({ title, content });
            }
            navigate('/');
        } catch (error) {
            if(isEdit){
                toast.error('Permission denied to edit this blog.');
            }
            console.error('Error saving blog:', error);
        }
    };

    if (loading) {
        return (
            <Container>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable pauseOnFocusLoss theme="light" />
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {isEdit ? 'Edit Blog' : 'Create New Blog'}
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        multiline
                        rows={10}
                        sx={{ mb: 3 }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            {isEdit ? 'Update' : 'Create'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default BlogForm; 