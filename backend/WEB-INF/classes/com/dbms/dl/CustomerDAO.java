package com.dbms.dl;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CustomerDAO {

    public void addCustomer(Customer c) throws SQLException {
        String sql = "INSERT INTO customer (Username, PasswordHash, CustomerName, Address, Phone, Email, GSTIN, Type) VALUES (?,?,?,?,?,?,?,?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, c.getUsername());
            ps.setString(2, c.getPasswordHash());
            ps.setString(3, c.getCustomerName());
            ps.setString(4, c.getAddress());
            ps.setString(5, c.getPhone());
            ps.setString(6, c.getEmail());
            ps.setString(7, c.getGSTIN());
            ps.setString(8, c.getType());
            ps.executeUpdate();
        }
    }

    public Customer getCustomerById(long id) throws SQLException {
        String sql = "SELECT * FROM customer WHERE CustomerID=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new Customer(
                        rs.getLong("CustomerID"),
                        rs.getString("Username"),
                        rs.getString("PasswordHash"),
                        rs.getString("CustomerName"),
                        rs.getString("Address"),
                        rs.getString("Phone"),
                        rs.getString("Email"),
                        rs.getString("GSTIN"),
                        rs.getString("Type"),
                        rs.getBigDecimal("AdvanceAmount"),
                        rs.getBigDecimal("DueAmount")
                );
            }
            return null;
        }
    }

    public void updateCustomer(Customer c) throws SQLException {
        String sql = "UPDATE customer SET Username=?, PasswordHash=?, CustomerName=?, Address=?, Phone=?, Email=?, GSTIN=?, Type=? WHERE CustomerID=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, c.getUsername());
            ps.setString(2, c.getPasswordHash());
            ps.setString(3, c.getCustomerName());
            ps.setString(4, c.getAddress());
            ps.setString(5, c.getPhone());
            ps.setString(6, c.getEmail());
            ps.setString(7, c.getGSTIN());
            ps.setString(8, c.getType());
            ps.setLong(9, c.getCustomerID());
            ps.executeUpdate();
        }
    }

    public void deleteCustomer(long id) throws SQLException {
        String sql = "DELETE FROM customer WHERE CustomerID=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        }
    }

    public List<Customer> getAllCustomers() throws SQLException {
        List<Customer> list = new ArrayList<>();
        String sql = "SELECT * FROM customer";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new Customer(
                        rs.getLong("CustomerID"),
                        rs.getString("Username"),
                        rs.getString("PasswordHash"),
                        rs.getString("CustomerName"),
                        rs.getString("Address"),
                        rs.getString("Phone"),
                        rs.getString("Email"),
                        rs.getString("GSTIN"),
                        rs.getString("Type"),
                        rs.getBigDecimal("AdvanceAmount"),
                        rs.getBigDecimal("DueAmount")
                ));
            }
        }
        return list;
    }
}
