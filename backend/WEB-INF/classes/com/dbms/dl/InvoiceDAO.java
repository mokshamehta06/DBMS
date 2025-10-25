package com.dbms.dl;
import java.sql.*;
import java.util.List;

public class InvoiceDAO {

    private ProductDAO productDAO = new ProductDAO();
    private CustomerDAO customerDAO = new CustomerDAO();
    private ShopkeeperDAO shopkeeperDAO = new ShopkeeperDAO();

    public void createInvoice(Invoice invoice, List<InvoiceItem> items) throws SQLException {
        String insertInvoice = "INSERT INTO invoice (CustomerID, ShopkeeperID, InvoiceDate, TotalBeforeTax, TotalGST, TotalAmount, Status) VALUES (?,?,?,?,?,?,?)";
        String insertItem = "INSERT INTO invoiceitem (InvoiceID, ProductID, Quantity, UnitPrice, GSTAmount, Total) VALUES (?,?,?,?,?,?)";
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            // Insert invoice
            PreparedStatement psInvoice = conn.prepareStatement(insertInvoice, Statement.RETURN_GENERATED_KEYS);
            psInvoice.setLong(1, invoice.getCustomerID());
            psInvoice.setLong(2, invoice.getShopkeeperID());
            psInvoice.setDate(3, new java.sql.Date(invoice.getInvoiceDate().getTime()));
            psInvoice.setBigDecimal(4, invoice.getTotalBeforeTax());
            psInvoice.setBigDecimal(5, invoice.getTotalGST());
            psInvoice.setBigDecimal(6, invoice.getTotalAmount());
            psInvoice.setString(7, invoice.getStatus()); // "Paid" or "Unpaid"
            psInvoice.executeUpdate();
            ResultSet rs = psInvoice.getGeneratedKeys();
            long invoiceId = 0;
            if (rs.next()) invoiceId = rs.getLong(1);

            // Insert invoice items & update stock
            PreparedStatement psItem = conn.prepareStatement(insertItem);
            for (InvoiceItem item : items) {
                psItem.setLong(1, invoiceId);
                psItem.setLong(2, item.getProductID());
                psItem.setBigDecimal(3, item.getQuantity());
                psItem.setBigDecimal(4, item.getUnitPrice());
                psItem.setBigDecimal(5, item.getGSTAmount());
                psItem.setBigDecimal(6, item.getTotal());
                psItem.addBatch();

                // update stock
                productDAO.updateStock(item.getProductID(), -item.getQuantity().doubleValue());
            }
            psItem.executeBatch();

            // Update customer's advance/due
            Customer c = customerDAO.getCustomerById(invoice.getCustomerID());
            if (invoice.getStatus().equalsIgnoreCase("Paid")) {
                c.setAdvanceAmount(c.getAdvanceAmount().add(invoice.getTotalAmount()));
            } else {
                c.setDueAmount(c.getDueAmount().add(invoice.getTotalAmount()));
            }
            customerDAO.updateCustomer(c);

            conn.commit();
        } catch (SQLException e) {
            if (conn != null) conn.rollback();
            throw e;
        } finally {
            if (conn != null) conn.setAutoCommit(true);
        }
    }
}
