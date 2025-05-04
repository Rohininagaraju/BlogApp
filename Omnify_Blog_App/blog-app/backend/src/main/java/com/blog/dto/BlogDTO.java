package com.blog.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BlogDTO {
    private Long id;
    private String title;
    private String content;
    private UserDTO author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 