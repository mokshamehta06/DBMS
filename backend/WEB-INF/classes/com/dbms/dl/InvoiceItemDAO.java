package com.dbms.dl;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class InvoiceItemDAO {

    public List<InvoiceItem> getItemsByInvoiceId(long invoiceId) throws SQLException {
        List<InvoiceItem> list = new ArrayList<>();
        String sql = "SELECT * FROM invoiceitem WHERE InvoiceID=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, invoiceId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                list.add(new InvoiceItem(
                        rs.getLong("ItemID"),
                        rs.getLong("InvoiceID"),
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
