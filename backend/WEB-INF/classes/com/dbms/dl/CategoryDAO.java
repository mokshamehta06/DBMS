package com.dbms.dl;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CategoryDAO {

    public void addCategory(Category c) throws SQLException {
        String sql = "INSERT INTO category (CategoryName, GSTRate, Description) VALUES (?,?,?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, c.getCategoryName());
            ps.setBigDecimal(2, c.getGSTRate());
            ps.setString(3, c.getDescription());
            ps.executeUpdate();
        }
    }

    public void updateCategory(Category c) throws SQLException {
        String sql = "UPDATE category SET CategoryName=?, GSTRate=?, Description=? WHERE CategoryID=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, c.getCategoryName());
            ps.setBigDecimal(2, c.getGSTRate());
            ps.setString(3, c.getDescription());
            ps.setLong(4, c.getCategoryID());
            ps.executeUpdate();
        }
    }

    public Category getCategoryById(long id) throws SQLException {
        String sql = "SELECT * FROM category WHERE CategoryID=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new Category(rs.getLong("CategoryID"),
                        rs.getString("CategoryName"),
                        rs.getBigDecimal("GSTRate"),
                        rs.getString("Description"));
            }
            return null;
        }
    }

    public List<Category> getAllCategories() throws SQLException {
        List<Category> list = new ArrayList<>();
        String sql = "SELECT * FROM category";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new Category(rs.getLong("CategoryID"),
                        rs.getString("CategoryName"),
                        rs.getBigDecimal("GSTRate"),
                        rs.getString("Description")));
            }
        }
        return list;
    }
}
