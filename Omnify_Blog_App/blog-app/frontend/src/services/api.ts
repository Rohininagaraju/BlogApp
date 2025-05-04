import axios from 'axios';
import { Blog, LoginCredentials, RegisterCredentials, PaginatedResponse } from '../types';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: async (credentials: LoginCredentials) => {
        const response = await api.post<{ token: string }>('/auth/login', credentials);
        localStorage.setItem('token', response.data.token);
        return response.data;
    },

    register: async (credentials: RegisterCredentials) => {
        const response = await api.post('/auth/register', credentials);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },
};

export const blogService = {
    getAllBlogs: async (page: number = 0, size: number = 10) => {
        const response = await api.get<PaginatedResponse<Blog>>(`/blogs?page=${page}&size=${size}`);
        return response.data;
    },

    getBlogById: async (id: number) => {
        const response = await api.get<Blog>(`/blogs/${id}`);
        return response.data;
    },

    createBlog: async (blog: { title: string; content: string }) => {
        const response = await api.post<Blog>('/blogs', blog);
        return response.data;
    },

    updateBlog: async (id: number, blog: { title: string; content: string }) => {
        const response = await api.put<Blog>(`/blogs/${id}`, blog);
        return response.data;
    },

    deleteBlog: async (id: number) => {
        await api.delete(`/blogs/${id}`);
    },
}; 