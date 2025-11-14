package com.example.streaum.entity;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class FileNode {
    private String name;
    private String path;
    private boolean isDirectory;
    private long size; // bytes
    private String lastModified;
    private List<FileNode> children = new ArrayList<>();

    public FileNode(String name, String path, boolean isDirectory, long size, String lastModified) {
        this.name = name;
        this.path = path;
        this.isDirectory = isDirectory;
        this.size = size;
        this.lastModified = lastModified;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public boolean isDirectory() {
        return isDirectory;
    }

    public void setDirectory(boolean directory) {
        isDirectory = directory;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public String getLastModified() {
        return lastModified;
    }

    public void setLastModified(String lastModified) {
        this.lastModified = lastModified;
    }

    public List<FileNode> getChildren() {
        return children;
    }

    public void setChildren(List<FileNode> children) {
        this.children = children;
    }

    public void addChild(FileNode child) {
        this.children.add(child);
    }
}
