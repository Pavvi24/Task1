package com.portfolio.controller;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin
@RequestMapping("/projects")
public class ProjectController {

    private List<Map<String, String>> projects = new ArrayList<>();

    public ProjectController() {
        Map<String, String> p = new HashMap<>();
        p.put("title", "Hostel Management System");
        p.put("description", "Full stack project");
        p.put("tech", "MERN");
        p.put("githubLink", "https://github.com/yourrepo");
        projects.add(p);
    }

    @GetMapping
    public List<Map<String, String>> getAll() {
        return projects;
    }

    @PostMapping
    public Map<String, String> add(@RequestBody Map<String, String> p) {
        projects.add(p);
        return p;
    }
}