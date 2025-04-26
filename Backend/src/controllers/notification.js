// notifications.js
import nodemailer from "nodemailer";

// In-memory storage for notifications
let notifications = [
  {
    id: 1,
    title: "Stock Alert",
    message: "A product is running low on stock.",
    read: false,
  },
];

// Configure your email transporter (adjust host, port, and auth details as needed)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // e.g., "smtp.gmail.com"
  port: 587,                // use 465 for secure connections if needed
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // replace with your email
    pass: process.env.EMAIL_PASS,      // replace with your email password or app-specific password
  },
});

/**
 * Sends a stock alert email for a given product.
 * Also records a notification when the email is sent.
 *
 * @param {Object} product - The product object containing name, stockCount, and status.
 */
export const sendStockAlertEmail = (product) => {
  const mailOptions = {
    from: `"Admin Notifications" ${process.env.EMAIL_USER} `,
    to: process.env.EMAIL_USER,
    subject: `Stock Alert: ${product.name} is ${product.status}`,
    text: `Product "${product.name}" has ${product.stockCount} units in stock. Status: ${product.status}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending stock alert email:", error);
    } else {
      console.log("Stock alert email sent:", info.response);

      // ✅ Include productName and status
      addNotification({
        id: Date.now(),
        title: "Stock Alert",
        message: `Product "${product.name}" has ${product.stockCount} units.`,
        productName: product.name,
        status: product.status,
        read: false,
      });
    }
  });
};

/**
 * Returns all stored notifications.
 *
 * @returns {Array} notifications array.
 */
export const getNotifications = () => notifications;

/**
 * Updates the read status of a notification.
 *
 * @param {number} id - The notification id.
 * @param {boolean} readStatus - New read status.
 * @returns {Object|null} The updated notification or null if not found.
 */
export const updateNotificationStatus = (id, readStatus) => {
  let updatedNotification = null;
  notifications = notifications.map((notif) => {
    if (notif.id === id) {
      updatedNotification = { ...notif, read: readStatus };
      return updatedNotification;
    }
    return notif;
  });
  return updatedNotification;
};

/**
 * Adds a new notification to the list.
 *
 * @param {Object} notification - The notification object to add.
 */
export const addNotification = (notification) => {
  notifications.push(notification);
};
