package com.restfull.api.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 250, columnDefinition = "NVARCHAR(250)")
    private String name;

    @Column(nullable = true, columnDefinition = "NVARCHAR(1000)")
    private String description;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Book> books = new HashSet<>();

}
