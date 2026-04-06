package com.ai.resume.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestControlller {

    @GetMapping("/test")
    public String test(){
        return "backend is fasting";
    }
}
