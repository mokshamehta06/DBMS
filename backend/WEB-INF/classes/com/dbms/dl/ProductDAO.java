package com.dbms.dl;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProductDAO {

    public void addProduct(Product p) throws SQLException {
        String sql = "INSERT INTO product (CategoryID, SupplierID, ProductName, HSN_Code, PriceBeforeTax, StockQuantity, Unit, Description, IsActive) VALUES (?,?,?,?,?,?,?,?,?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, p.getCategoryID());
            ps.setLong(2, p.getSupplierID());
            ps.setString(3, p.getProductName());
            ps.setString(4, p.getHSNCode());
            ps.setBigDecimal(5, p.getPriceBeforeTax());
            ps.setBigDecimal(6, p.getStockQuantity());
            ps.setString(7, p.getUnit());
            ps.setString(8, p.getDescription());
            ps.setBoolean(9, p.getIsActive());
            ps.executeUpdate();
        }
    }

    public Product getProductById(long id) throws SQLException {
        String sql = "SELECT * FROM product WHERE ProductID=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new Product(
                        rs.getLong("ProductID"),
                        rs.getLong("CategoryID"),
                        rs.getLong("SupplierID"),
                        rs.getString("ProductName"),
                        rs.getString("HSN_Code"),
                        rs.getBigDecimal("PriceBeforeTax"),
                        rs.getBigDecimal("StockQuantity"),
                        rs.getString("Unit"),
                        rs.getString("Description"),
                        rs.getBoolean("IsActive")
                );
            }
            return null;
        }
    }

    public void updateProduct(Product p) throws SQLException {
        String sql = "UPDATE product SET CategoryID=?, SupplierID=?, ProductName=?, HSN_Code=?, PriceBeforeTax=?, StockQuantity=?, Unit=?, Description=?, IsActive=? WHERE ProductID=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, p.getCategoryID());
            ps.setLong(2, p.getSupplierID());
            ps.setString(3, p.getProductName());
            ps.setString(4, p.getHSNCode());
            ps.setBigDecimal(5, p.getPriceBeforeTax());
            ps.setBigDecimal(6, p.getStockQuantity());
            ps.setString(7, p.getUnit());
            ps.setString(8, p.getDescription());
            ps.setBoolean(9, p.getIsActive());
            ps.setLong(10, p.getProductID());
            ps.executeUpdate();
        }
    }

    public void deleteProduct(long id) throws SQLException {
        String sql = "DELETE FROM product WHERE ProductID=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        }
    }

    public List<Product> getAllProducts() throws SQLException {
        List<Product> list = new ArrayList<>();
        String sql = "SELECT * FROM product";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new Product(
                        rs.getLong("ProductID"),
                        rs.getLong("CategoryID"),
                        rs.getLong("SupplierID"),
                        rs.getString("ProductName"),
                        rs.getString("HSN_Code"),
                        rs.getBigDecimal("PriceBeforeTax"),
                        rs.getBigDecimal("StockQuantity"),
                        rs.getString("Unit"),
                        rs.getString("Description"),
                        rs.getBoolean("IsActive")
                ));
            }
        }
        return list;
    }

    // Decrement stock (used in transactions)
    public void updateStock(long productId, double quantityChange) throws SQLException {
        String sql = "UPDATE product SET StockQuantity = StockQuantity + ? WHERE ProductID=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setDouble(1, quantityChange); // can be negative
            ps.setLong(2, productId);
            ps.executeUpdate();
        }
    }
}
