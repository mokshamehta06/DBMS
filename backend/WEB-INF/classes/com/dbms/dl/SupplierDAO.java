package com.dbms.dl;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SupplierDAO {

    public void addSupplier(Supplier s) throws SQLException {
        String sql = "INSERT INTO supplier (SupplierName, Address, Phone, Email, GSTIN) VALUES (?,?,?,?,?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, s.getSupplierName());
            ps.setString(2, s.getAddress());
            ps.setString(3, s.getPhone());
            ps.setString(4, s.getEmail());
            ps.setString(5, s.getGSTIN());
            ps.executeUpdate();
        }
    }

    public void updateSupplier(Supplier s) throws SQLException {
        String sql = "UPDATE supplier SET SupplierName=?, Address=?, Phone=?, Email=?, GSTIN=? WHERE SupplierID=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, s.getSupplierName());
            ps.setString(2, s.getAddress());
            ps.setString(3, s.getPhone());
            ps.setString(4, s.getEmail());
            ps.setString(5, s.getGSTIN());
            ps.setLong(6, s.getSupplierID());
            ps.executeUpdate();
        }
    }

    public Supplier getSupplierById(long id) throws SQLException {
        String sql = "SELECT * FROM supplier WHERE SupplierID=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new Supplier(rs.getLong("SupplierID"),
                        rs.getString("SupplierName"),
                        rs.getString("Address"),
                        rs.getString("Phone"),
                        rs.getString("Email"),
                        rs.getString("GSTIN"));
            }
            return null;
        }
    }

    public List<Supplier> getAllSuppliers() throws SQLException {
        List<Supplier> list = new ArrayList<>();
        String sql = "SELECT * FROM supplier";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new Supplier(rs.getLong("SupplierID"),
                        rs.getString("SupplierName"),
                        rs.getString("Address"),
                        rs.getString("Phone"),
                        rs.getString("Email"),
                        rs.getString("GSTIN")));
            }
        }
        return list;
    }
}
