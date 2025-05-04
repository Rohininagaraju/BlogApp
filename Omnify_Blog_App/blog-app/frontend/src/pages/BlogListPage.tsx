import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Pagination,
    Grid
} from '@mui/material';

import { blogService } from '../services/api';
import { Blog } from '../types';
import { useAuth } from '../contexts/AuthContext';

const BlogListPage: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    console.log('AuthContext user:', user);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await blogService.getAllBlogs(page - 1);
                setBlogs(response.content);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchBlogs();
        setLoading(false);
    }, [page]);

    useEffect(() => {
        console.log("Logged-in user:", user);
    }, [user]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleDelete = async (id: number) => {
        try {
            await blogService.deleteBlog(id);
            // Refresh list or redirect
        } catch (error) {
            alert('Failed to delete blog');
        }
    };

    console.log('Logged-in user:', user);

    if (loading) return <div>Loading...</div>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Blog Posts
                </Typography>
                {isAuthenticated && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/blogs/new')}
                    >
                        Create New Blog
                    </Button>
                )}
            </Box>

            <Grid container spacing={3}>
                {blogs.map((blog) => {
                    console.log('Blog author:', blog.author);
                    console.log('Emails match:', user && user.email && blog.author && blog.author.email && user.email.trim().toLowerCase() === blog.author.email.trim().toLowerCase());

                    return (
                        <Grid item xs={12} key={blog.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {blog.title}
                                    </Typography>
                                    <Typography color="textSecondary" gutterBottom>
                                        By {blog.author.name} • {new Date(blog.createdAt).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" component="p" sx={{ mt: 2 }}>
                                        {blog.content.substring(0, 200)}...
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => navigate(`/blogs/${blog.id}`)}>
                                        Read More
                                    </Button>
                                    {user?.email === blog.author.email && (
                                        <>
                                            <Button size="small" onClick={() => navigate(`/blogs/${blog.id}/edit`)}>
                                                Edit
                                            </Button>
                                            <Button size="small" color="error" onClick={() => handleDelete(blog.id)}>
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{ mt: 3, justifyContent: 'center' }}
            />
        </Container>
    );
};

export default BlogListPage;