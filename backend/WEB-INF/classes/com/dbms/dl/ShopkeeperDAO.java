package com.dbms.dl;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ShopkeeperDAO {

    public void addShopkeeper(Shopkeeper s) throws SQLException {
        String sql = "INSERT INTO shopkeeper (Username, PasswordHash, ShopName, OwnerName, Address, Phone, Email, GSTIN, State) VALUES (?,?,?,?,?,?,?,?,?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, s.getUsername());
            ps.setString(2, s.getPasswordHash());
            ps.setString(3, s.getShopName());
            ps.setString(4, s.getOwnerName());
            ps.setString(5, s.getAddress());
            ps.setString(6, s.getPhone());
            ps.setString(7, s.getEmail());
            ps.setString(8, s.getGSTIN());
            ps.setString(9, s.getState());
            ps.executeUpdate();
        }
    }

    public Shopkeeper getShopkeeperById(long id) throws SQLException {
        String sql = "SELECT * FROM shopkeeper WHERE ShopkeeperID=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new Shopkeeper(
                        rs.getLong("ShopkeeperID"),
                        rs.getString("Username"),
                        rs.getString("PasswordHash"),
                        rs.getString("ShopName"),
                        rs.getString("OwnerName"),
                        rs.getString("Address"),
                        rs.getString("Phone"),
                        rs.getString("Email"),
                        rs.getString("GSTIN"),
                        rs.getString("State"),
                        rs.getBigDecimal("AdvanceAmount"),
                        rs.getBigDecimal("DueAmount")
                );
            }
            return null;
        }
    }

    public List<Shopkeeper> getAllShopkeepers() throws SQLException {
        List<Shopkeeper> list = new ArrayList<>();
        String sql = "SELECT * FROM shopkeeper";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new Shopkeeper(
                        rs.getLong("ShopkeeperID"),
                        rs.getString("Username"),
                        rs.getString("PasswordHash"),
                        rs.getString("ShopName"),
                        rs.getString("OwnerName"),
                        rs.getString("Address"),
                        rs.getString("Phone"),
                        rs.getString("Email"),
                        rs.getString("GSTIN"),
                        rs.getString("State"),
                        rs.getBigDecimal("AdvanceAmount"),
                        rs.getBigDecimal("DueAmount")
                ));
            }
        }
        return list;
    }

    public void updateShopkeeper(Shopkeeper s) throws SQLException {
        String sql = "UPDATE shopkeeper SET Username=?, PasswordHash=?, ShopName=?, OwnerName=?, Address=?, Phone=?, Email=?, GSTIN=?, State=? WHERE ShopkeeperID=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, s.getUsername());
            ps.setString(2, s.getPasswordHash());
            ps.setString(3, s.getShopName());
            ps.setString(4, s.getOwnerName());
            ps.setString(5, s.getAddress());
            ps.setString(6, s.getPhone());
            ps.setString(7, s.getEmail());
            ps.setString(8, s.getGSTIN());
            ps.setString(9, s.getState());
            ps.setLong(10, s.getShopkeeperID());
            ps.executeUpdate();
        }
    }

    public void deleteShopkeeper(long id) throws SQLException {
        String sql = "DELETE FROM shopkeeper WHERE ShopkeeperID=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        }
    }
}
