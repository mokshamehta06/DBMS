package com.dbms.dl;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PurchaseItemDAO {

    public List<PurchaseItem> getItemsByPOId(long poId) throws SQLException {
        List<PurchaseItem> list = new ArrayList<>();
        String sql = "SELECT * FROM purchaseitem WHERE POID=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, poId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                list.add(new PurchaseItem(
                        rs.getLong("POItemID"),
                        rs.getLong("POID"),
                        rs.getLong("ProductID"),
                        rs.getBigDecimal("Quantity"),
                        rs.getBigDecimal("UnitPrice"),
                        rs.getBigDecimal("GSTAmount"),
                        rs.getBigDecimal("Total")
                ));
            }
        }
        return list;
    }
}
