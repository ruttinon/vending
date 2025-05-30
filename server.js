const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const firebaseAdmin = require("firebase-admin");
const fetch = require("node-fetch");
const app = express();  // Node.js app for handling requests

<<<<<<< HEAD
// ใช้ CORS และ bodyParser (เพิ่มการตั้งค่า limit)
app.use(cors());
app.use(bodyParser.json({ limit: "200mb" }));

=======

// ใช้ CORS และ bodyParser (เพิ่มการตั้งค่า limit)
app.use(cors());
app.use(bodyParser.json({ limit: "200mb" }));
>>>>>>> f8ae43cd7cdb60f9367994b0ed4151e06f3845ec
// ตั้งค่า Firebase
const serviceAccount = require("./this-pro-done-firebase-adminsdk-fbsvc-72157f3dbb.json");
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
<<<<<<< HEAD
  databaseURL: "https://this-pro-done-default-rtdb.asia-southeast1.firebasedatabase.app" // URL ของ Firebase Realtime Database ของคุณ
=======
  databaseURL: "https://this-pro-done-default-rtdb.asia-southeast1.firebasedatabase.app" // ใส่ URL ของ Firebase Realtime Database ของคุณ
>>>>>>> f8ae43cd7cdb60f9367994b0ed4151e06f3845ec
});

// เข้าถึง Firebase Realtime Database
const db = firebaseAdmin.database();

// กำหนดที่เก็บไฟล์อัปโหลด
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

<<<<<<< HEAD
=======

>>>>>>> f8ae43cd7cdb60f9367994b0ed4151e06f3845ec
// เสิร์ฟไฟล์ static จาก public
app.use(express.static(path.join(__dirname, "public")));

// เสิร์ฟหน้าแรกเป็น menu.html
app.get("/", (req, res) => {
<<<<<<< HEAD
  console.log("Serving home.html...");
  res.sendFile(path.resolve(__dirname, "public", "home.html"));
=======
  console.log("Serving menu.html...");
  res.sendFile(path.resolve(__dirname, "public", "menu.html"));
>>>>>>> f8ae43cd7cdb60f9367994b0ed4151e06f3845ec
});

// ดึงสินค้าทั้งหมด (เฉพาะที่ visible = true)
app.get("/products", async (req, res) => {
  try {
    const snapshot = await db.ref("products").once("value");
    const allProducts = snapshot.val();
    const visibleOnly = {};

    for (const id in allProducts) {
      const product = allProducts[id];
      if (product.visible) {
        visibleOnly[id] = product;
      }
    }

    res.json(visibleOnly);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// เพิ่มสินค้าใหม่ (พร้อม sold: 0)
app.post("/products", async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    if (!name || !price || stock === undefined) {
      return res.status(400).json({ error: "Missing fields!" });
    }

    const newProductRef = db.ref("products").push();
    await newProductRef.set({
      name,
      price,
      stock,
      visible: true,
      sold: 0
    });

    res.json({ message: "✅ เพิ่มสินค้าใหม่สำเร็จ!", productId: newProductRef.key });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// อัปเดตสต็อกสินค้า
app.patch("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const { stock } = req.body;

    if (stock === undefined) {
      return res.status(400).json({ error: "Stock is required!" });
    }

    await db.ref(`products/${productId}`).update({ stock });
    res.json({ message: "✅ อัปเดตสต็อกสำเร็จ!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// บันทึกคำสั่งซื้อ
app.post("/orders", async (req, res) => {
  try {
    const order = req.body;
    const newOrderRef = db.ref("orders").push();
    await newOrderRef.set(order);

    res.json({ message: "✅ คำสั่งซื้อถูกบันทึก!", orderId: newOrderRef.key });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// เสิร์ฟข้อมูลการสแกนจากหน้าจอ
app.post("/scan", upload.single("image"), async (req, res) => {
  try {
    const imageData = req.file.path;
    const response = await fetch("http://localhost:5001/scan", {  // Flask API
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageData })
    });
    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error("Error during scanning:", error);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
});
<<<<<<< HEAD

// เพิ่มฟังก์ชันในการรับการวิเคราะห์เท้าจากหน้าเว็บ
app.get("/foot-type", async (req, res) => {
  try {
    const snapshot = await db.ref("foot-type").once("value");  // อ่านข้อมูลประเภทเท้าจาก Firebase
    const footType = snapshot.val();  // ข้อมูลประเภทเท้า เช่น "Flat Foot", "High Arch", "Normal"
    res.json({ footType });  // ส่งข้อมูลกลับไปยังหน้า HTML
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

=======
>>>>>>> f8ae43cd7cdb60f9367994b0ed4151e06f3845ec
// เริ่มต้นเซิร์ฟเวอร์
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
<<<<<<< HEAD
});
=======
});
>>>>>>> f8ae43cd7cdb60f9367994b0ed4151e06f3845ec
