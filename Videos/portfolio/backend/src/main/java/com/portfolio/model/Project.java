package com.portfolio.model;

import jakarta.persistence.*;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String tech;
    private String githubLink;

    public Project() {}

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getTech() { return tech; }
    public String getGithubLink() { return githubLink; }

    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setTech(String tech) { this.tech = tech; }
    public void setGithubLink(String githubLink) { this.githubLink = githubLink; }
}