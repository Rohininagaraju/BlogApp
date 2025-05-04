package com.blog.service;

import com.blog.dto.BlogDTO;
import com.blog.dto.UserDTO;
import com.blog.entity.Blog;
import com.blog.entity.User;
import com.blog.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BlogService {

    @Autowired
    private BlogRepository blogRepository;

    public Page<BlogDTO> getAllBlogs(Pageable pageable) {
        return blogRepository.findAll(pageable).map(this::convertToDTO);
    }

    public Optional<BlogDTO> getBlogById(Long id) {
        return blogRepository.findById(id).map(this::convertToDTO);
    }

    public BlogDTO createBlog(Blog blog) {
        Blog savedBlog = blogRepository.save(blog);
        return convertToDTO(savedBlog);
    }

    public Optional<BlogDTO> updateBlog(Long id, Blog blog, User user) {
        return blogRepository.findById(id)
                .filter(existingBlog -> existingBlog.getAuthor().getId().equals(user.getId()))
                .map(existingBlog -> {
                    existingBlog.setTitle(blog.getTitle());
                    existingBlog.setContent(blog.getContent());
                    return convertToDTO(blogRepository.save(existingBlog));
                });
    }

    public boolean deleteBlog(Long id, User user) {
        return blogRepository.findById(id)
                .filter(blog -> blog.getAuthor().getId().equals(user.getId()))
                .map(blog -> {
                    blogRepository.delete(blog);
                    return true;
                })
                .orElse(false);
    }

    private BlogDTO convertToDTO(Blog blog) {
        BlogDTO dto = new BlogDTO();
        dto.setId(blog.getId());
        dto.setTitle(blog.getTitle());
        dto.setContent(blog.getContent());
        dto.setCreatedAt(blog.getCreatedAt());
        dto.setUpdatedAt(blog.getUpdatedAt());

        UserDTO authorDTO = new UserDTO();
        authorDTO.setId(blog.getAuthor().getId());
        authorDTO.setName(blog.getAuthor().getName());
        authorDTO.setEmail(blog.getAuthor().getEmail());
        dto.setAuthor(authorDTO);

        return dto;
    }
} 