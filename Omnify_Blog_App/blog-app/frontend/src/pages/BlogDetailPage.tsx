import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Divider,
} from '@mui/material';
import { blogService } from '../services/api';
import { Blog } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';

const BlogDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                if (id) {
                    const data = await blogService.getBlogById(parseInt(id));
                    setBlog(data);
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    const handleDelete = async () => {
        if (blog && window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await blogService.deleteBlog(blog.id);
                navigate('/');
            } catch (error) {
                toast.error('Permission denied to delete this blog.');
                console.error('Error deleting blog:', error);
            }
        }
    };

    if (loading) {
        return (
            <Container>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    if (!blog) {
        return (
            <Container>
                <Typography>Blog not found</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        {blog.title}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                        By {blog.author.name} • {new Date(blog.createdAt).toLocaleDateString()}
                    </Typography>
                    {isAuthenticated && blog.author.id === 1 && ( // Replace 1 with actual user ID
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate(`/blogs/${blog.id}/edit`)}
                                sx={{ mr: 2 }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </Box>
                    )}
                </Box>

                <Divider sx={{ my: 4 }} />

                <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-line' }}>
                    {blog.content}
                </Typography>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="caption" color="textSecondary">
                        Last updated: {new Date(blog.updatedAt).toLocaleDateString()}
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default BlogDetailPage; 