package com.dbms.dl;
import java.sql.*;
import java.util.List;

public class PurchaseOrderDAO {

    private ProductDAO productDAO = new ProductDAO();

    public void createPurchaseOrder(PurchaseOrder po, List<PurchaseItem> items) throws SQLException {
        String insertPO = "INSERT INTO purchaseorder (SupplierID, ShopkeeperID, PODate, TotalBeforeTax, TotalGST, TotalAmount) VALUES (?,?,?,?,?,?)";
        String insertItem = "INSERT INTO purchaseitem (POID, ProductID, Quantity, UnitPrice, GSTAmount, Total) VALUES (?,?,?,?,?,?)";

        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            PreparedStatement psPO = conn.prepareStatement(insertPO, Statement.RETURN_GENERATED_KEYS);
            psPO.setLong(1, po.getSupplierID());
            psPO.setLong(2, po.getShopkeeperID());
            psPO.setDate(3, new java.sql.Date(po.getPODate().getTime()));
            psPO.setBigDecimal(4, po.getTotalBeforeTax());
            psPO.setBigDecimal(5, po.getTotalGST());
            psPO.setBigDecimal(6, po.getTotalAmount());
            psPO.executeUpdate();
            ResultSet rs = psPO.getGeneratedKeys();
            long poId = 0;
            if (rs.next()) poId = rs.getLong(1);

            PreparedStatement psItem = conn.prepareStatement(insertItem);
            for (PurchaseItem item : items) {
                psItem.setLong(1, poId);
                psItem.setLong(2, item.getProductID());
                psItem.setBigDecimal(3, item.getQuantity());
                psItem.setBigDecimal(4, item.getUnitPrice());
                psItem.setBigDecimal(5, item.getGSTAmount());
                psItem.setBigDecimal(6, item.getTotal());
                psItem.addBatch();

                // update stock
                productDAO.updateStock(item.getProductID(), item.getQuantity().doubleValue());
            }
            psItem.executeBatch();
            conn.commit();
        } catch (SQLException e) {
            if (conn != null) conn.rollback();
            throw e;
        } finally {
            if (conn != null) conn.setAutoCommit(true);
        }
    }
}
