import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { DatabaseSync } from "node:sqlite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static(path.join(process.cwd(), "public")));

// Initialize SQLite database
const db = new DatabaseSync("glamping.db");

// Enable foreign keys
db.exec("PRAGMA foreign_keys = ON;");

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('SUPERADMIN', 'ADMIN', 'RECEPCION', 'FINANCES')),
    status TEXT DEFAULT 'Activo',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    document_id TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS domes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    capacity INTEGER DEFAULT 2,
    price_per_night REAL NOT NULL,
    image_url TEXT,
    images TEXT,
    status TEXT DEFAULT 'Disponible' CHECK(status IN ('Disponible', 'Mantenimiento', 'Fuera de servicio')),
    features TEXT,
    policies TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reservation_code TEXT UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL,
    dome_id INTEGER NOT NULL,
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    guests INTEGER DEFAULT 2,
    status TEXT DEFAULT 'Pendiente' CHECK(status IN ('Pendiente', 'Pendiente de pago', 'Confirmada', 'Check-in', 'Hospedado', 'Check-out', 'Completada', 'Cancelada', 'No show')),
    payment_status TEXT DEFAULT 'Pendiente' CHECK(payment_status IN ('Pendiente', 'Parcial', 'Pagado', 'Reembolsado')),
    total_amount REAL NOT NULL,
    amount_paid REAL DEFAULT 0,
    amount_pending REAL NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    updated_by TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (dome_id) REFERENCES domes(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reservation_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    method TEXT NOT NULL,
    status TEXT DEFAULT 'Aprobado',
    recorded_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id)
  );

  CREATE TABLE IF NOT EXISTS maintenance_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dome_id INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    reason TEXT,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dome_id) REFERENCES domes(id)
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT,
    action TEXT NOT NULL,
    target_type TEXT,
    target_id TEXT,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed initial data if empty
const domeCount = db.prepare("SELECT COUNT(*) as count FROM domes").get() as { count: number };
if (domeCount.count === 0) {
  console.log("Seeding initial database data...");

  // Seed Users
  const insertUser = db.prepare(`INSERT INTO users (username, password_hash, full_name, email, role, status) VALUES (?, ?, ?, ?, ?, ?)`);
  insertUser.run("superadmin", "admin123", "Carlos SuperAdmin", "superadmin@ecoglampingchinauta.com", "SUPERADMIN", "Activo");
  insertUser.run("admin", "admin123", "María Admin", "admin@ecoglampingchinauta.com", "ADMIN", "Activo");
  insertUser.run("reception", "admin123", "Ana Recepción", "reception@ecoglampingchinauta.com", "RECEPCION", "Activo");
  insertUser.run("finanzas", "admin123", "Pedro Finanzas", "finanzas@ecoglampingchinauta.com", "FINANCES", "Activo");

  // Seed Domes
  const insertDome = db.prepare(`INSERT INTO domes (name, code, description, capacity, price_per_night, image_url, status, features, policies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  insertDome.run(
    "Domo Huitaca",
    "DOMO-01",
    "Romántico domo geodésico con jacuzzi privado al aire libre, malla de descanso y vista privilegiada sobre las montañas de Chinauta.",
    2,
    380000,
    "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80",
    "Disponible",
    "Jacuzzi privado, Wi-Fi Starlink, Baño privado, Cama King, Desayuno campesino incluido, Calefacción",
    "No se admiten mascotas. Check-in: 3:00 PM. Check-out: 12:00 PM."
  );
  insertDome.run(
    "Domo Bochica",
    "DOMO-02",
    "Domo familiar de alta gama con cúpula transparente para observación de estrellas, terraza privada y zona BBQ.",
    4,
    450000,
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    "Disponible",
    "Cúpula cenital panorámica, 2 camas Queen, Terraza, Zona BBQ, Malla flotante, Desayuno incluido",
    "Ambiente familiar. Prohibido fumar dentro del domo. Check-in: 3:00 PM."
  );
  insertDome.run(
    "Domo Bachué",
    "DOMO-03",
    "Acogedor domo inmerso en el bosque nativo con tina de madera de cedro caliente y hamaca de descanso.",
    2,
    350000,
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
    "Disponible",
    "Tina de cedro japonesa, Wi-Fi, Estufa a leña ecológica, Desayuno artesanal, Vista al bosque",
    "Ideal para parejas en desconexión total. Check-in: 3:00 PM."
  );
  insertDome.run(
    "Domo Luna Chía",
    "DOMO-04",
    "Lujoso domo luminoso con fogata privada exterior, telescopio y vista panorámica al valle de Fusagasugá.",
    3,
    420000,
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80",
    "Disponible",
    "Fogata privada, Telescopio astronómico, Cama Queen + sofá cama, Jacuzzi hidromasaje, Desayuno",
    "Pet-friendly (bajo solicitud). Check-in: 3:00 PM."
  );
  insertDome.run(
    "Domo Chiminichagua",
    "DOMO-05",
    "Domo de eco-lujo con ducha de hidromasaje vertical, balcón privado y ambiente místico rodeado de naturaleza.",
    2,
    390000,
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    "Disponible",
    "Ducha de hidromasaje, Balcón privado, Minibar ecológico, Cama King, Desayuno de la casa",
    "Prohibido fiestas o música a alto volumen. Check-in: 3:00 PM."
  );
  insertDome.run(
    "Domo Xue Sol",
    "DOMO-06",
    "Domo VIP Máster con piscina privada climatizada, sala exterior flotante y máxima exclusividad.",
    4,
    480000,
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    "Disponible",
    "Piscina privada climatizada, Sala exterior, Cama King + 2 camas sencillas, Cafetera Nespresso, VIP",
    "Experiencia exclusiva para adultos y familias. Check-in: 3:00 PM."
  );

  // Seed sample Customers
  const insertCustomer = db.prepare(`INSERT INTO customers (name, phone, whatsapp, email, document_id, notes) VALUES (?, ?, ?, ?, ?, ?)`);
  const c1 = insertCustomer.run("Alejandro Gómez", "+57 310 4567890", "+573104567890", "alejandro.gomez@gmail.com", "1020304050", "Cliente frecuente VIP").lastInsertRowid;
  const c2 = insertCustomer.run("Sofía Rodríguez", "+57 320 9876543", "+573209876543", "sofia.rodriguez@hotmail.com", "52987654", "Aniversario de bodas").lastInsertRowid;
  const c3 = insertCustomer.run("Carlos Mendoza", "+57 315 2345678", "+573152345678", "cmendoza@empresa.co", "79123456", "Reserva corporativa").lastInsertRowid;

  // Seed sample Reservations
  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const in1 = new Date(); in1.setDate(today.getDate() + 2);
  const out1 = new Date(); out1.setDate(today.getDate() + 4);

  const in2 = new Date(); in2.setDate(today.getDate() - 1);
  const out2 = new Date(); out2.setDate(today.getDate() + 1);

  const in3 = new Date(); in3.setDate(today.getDate() + 5);
  const out3 = new Date(); out3.setDate(today.getDate() + 7);

  const insertRes = db.prepare(`INSERT INTO reservations (reservation_code, customer_id, dome_id, check_in, check_out, guests, status, payment_status, total_amount, amount_paid, amount_pending, notes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  
  insertRes.run("EGC-9482", c1, 1, formatDate(in1), formatDate(out1), 2, "Confirmada", "Pagado", 760000, 760000, 0, "Solicitó decoración romántica", "Carlos SuperAdmin");
  insertRes.run("EGC-3829", c2, 2, formatDate(in2), formatDate(out2), 4, "Hospedado", "Pagado", 900000, 900000, 0, "Check-in realizado sin novedad", "Ana Recepción");
  insertRes.run("EGC-1029", c3, 4, formatDate(in3), formatDate(out3), 2, "Pendiente", "Pendiente", 840000, 0, 840000, "Pendiente de transferencia", "Sistema Online");

  // Seed sample Payments
  const insertPay = db.prepare(`INSERT INTO payments (reservation_id, amount, method, status, recorded_by) VALUES (?, ?, ?, ?, ?)`);
  insertPay.run(1, 760000, "Wompi", "Aprobado", "Sistema Online");
  insertPay.run(2, 900000, "Transferencia Bancaria", "Aprobado", "Ana Recepción");

  // Seed Settings
  const insertSetting = db.prepare(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`);
  insertSetting.run("glamping_name", "Eco Glamping Chinauta");
  insertSetting.run("whatsapp", "+57 310 1234567");
  insertSetting.run("email", "contacto@ecoglampingchinauta.com");
  insertSetting.run("address", "Vía Principal Chinauta Km 4.5, Fusagasugá, Cundinamarca");
  insertSetting.run("currency", "COP");
  insertSetting.run("timezone", "America/Bogota");

  // Seed Audit log
  db.prepare(`INSERT INTO audit_logs (user_name, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)`).run(
    "Carlos SuperAdmin", "INICIALIZACION", "Sistema", "0", "Base de datos inicializada con domos y datos de prueba."
  );

  console.log("Database seeded successfully.");
}

// Helper for logging audit
function logAudit(userName: string, action: string, targetType: string, targetId: string, details: string) {
  try {
    const stmt = db.prepare(`INSERT INTO audit_logs (user_name, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)`);
    stmt.run(userName || "Sistema", action, targetType, targetId, details);
  } catch (err) {
    console.error("Audit log error:", err);
  }
}

// API Routes

// 1. Domes
app.get("/api/domes", (req, res) => {
  try {
    const rawDomes = db.prepare("SELECT * FROM domes ORDER BY id ASC").all();
    const domes = rawDomes.map((d: any) => {
      let images: string[] = [];
      if (d.images) {
        try {
          images = JSON.parse(d.images);
        } catch (_) {
          images = [];
        }
      }
      return { ...d, images };
    });
    res.json(domes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/domes", (req, res) => {
  try {
    const { name, code, description, capacity, price_per_night, image_url, images, status, features, policies, user_name } = req.body;
    const imagesStr = Array.isArray(images) ? JSON.stringify(images) : typeof images === 'string' ? images : null;
    const stmt = db.prepare(`INSERT INTO domes (name, code, description, capacity, price_per_night, image_url, images, status, features, policies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    const info = stmt.run(name, code, description, capacity, price_per_night, image_url, imagesStr, status || 'Disponible', features, policies);
    logAudit(user_name, "CREAR_DOMO", "Domo", String(info.lastInsertRowid), `Creación del domo ${name} (${code})`);
    res.json({ success: true, id: info.lastInsertRowid });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/domes/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, capacity, price_per_night, image_url, images, status, features, policies, user_name } = req.body;
    const imagesStr = Array.isArray(images) ? JSON.stringify(images) : typeof images === 'string' ? images : null;
    const stmt = db.prepare(`UPDATE domes SET name = ?, code = ?, description = ?, capacity = ?, price_per_night = ?, image_url = ?, images = COALESCE(?, images), status = ?, features = ?, policies = ? WHERE id = ?`);
    stmt.run(name, code, description, capacity, price_per_night, image_url, imagesStr, status, features, policies, id);
    logAudit(user_name, "ACTUALIZAR_DOMO", "Domo", id, `Actualización de domo ${name} (${status})`);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/upload-video", (req, res) => {
  try {
    const { domeId, filename, videoData } = req.body;
    if (!videoData) {
      return res.status(400).json({ error: "No video data provided" });
    }
    const cleanBase64 = videoData.replace(/^data:video\/\w+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");
    const targetDir = path.join(process.cwd(), "public", "assets", "videos");
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const safeName = filename || `domo_${domeId || 1}_huitaca.mp4`;
    const targetFile = path.join(targetDir, safeName);
    fs.writeFileSync(targetFile, buffer);

    try {
      const srcDir = path.join(process.cwd(), "src", "assets", "videos");
      if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });
      fs.writeFileSync(path.join(srcDir, safeName), buffer);
    } catch (_) {}

    const videoUrl = `/assets/videos/${safeName}`;
    res.json({ success: true, url: videoUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/upload-image", (req, res) => {
  try {
    const { domeId, filename, imageData } = req.body;
    if (!imageData) {
      return res.status(400).json({ error: "No image data provided" });
    }
    const cleanBase64 = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");
    const targetDir = path.join(process.cwd(), "public", "assets", "images");
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const ext = filename?.split('.').pop() || 'jpg';
    const safeName = filename || `dome_${domeId || 1}_user_${Date.now()}.${ext}`;
    const targetFile = path.join(targetDir, safeName);
    fs.writeFileSync(targetFile, buffer);

    try {
      const srcDir = path.join(process.cwd(), "src", "assets", "images");
      if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });
      fs.writeFileSync(path.join(srcDir, safeName), buffer);
    } catch (_) {}

    const imageUrl = `/assets/images/${safeName}`;

    // Optionally update the dome in SQLite database if domeId is provided
    if (domeId) {
      try {
        const row = db.prepare("SELECT images FROM domes WHERE id = ?").get(domeId) as any;
        let existingImages: string[] = [];
        if (row && row.images) {
          try {
            existingImages = JSON.parse(row.images);
          } catch (_) {
            existingImages = [];
          }
        }
        if (!existingImages.includes(imageUrl)) {
          existingImages.unshift(imageUrl);
          db.prepare("UPDATE domes SET images = ? WHERE id = ?").run(JSON.stringify(existingImages), domeId);
        }
      } catch (dbErr) {
        console.warn("Could not append image to dome DB record:", dbErr);
      }
    }

    res.json({ success: true, url: imageUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Maintenance / Blocks
app.get("/api/maintenance", (req, res) => {
  try {
    const blocks = db.prepare(`
      SELECT m.*, d.name as dome_name 
      FROM maintenance_blocks m 
      JOIN domes d ON m.dome_id = d.id 
      ORDER BY m.start_date DESC
    `).all();
    res.json(blocks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/maintenance", (req, res) => {
  try {
    const { dome_id, start_date, end_date, reason, user_name } = req.body;
    // Check overlapping reservations
    const overlap = db.prepare(`
      SELECT COUNT(*) as count FROM reservations 
      WHERE dome_id = ? AND status NOT IN ('Cancelada', 'Completada', 'No show')
      AND check_in < ? AND check_out > ?
    `).get(dome_id, end_date, start_date) as { count: number };

    if (overlap.count > 0) {
      return res.status(400).json({ error: "No se puede bloquear el domo: existen reservas confirmadas en ese rango de fechas." });
    }

    const stmt = db.prepare(`INSERT INTO maintenance_blocks (dome_id, start_date, end_date, reason, created_by) VALUES (?, ?, ?, ?, ?)`);
    const info = stmt.run(dome_id, start_date, end_date, reason, user_name);
    
    // Set dome status to Fuera de servicio if maintenance is active now
    const todayStr = new Date().toISOString().split("T")[0];
    if (start_date <= todayStr && end_date >= todayStr) {
      db.prepare(`UPDATE domes SET status = 'Fuera de servicio' WHERE id = ?`).run(dome_id);
    }

    logAudit(user_name, "CREAR_BLOQUEO", "Mantenimiento", String(info.lastInsertRowid), `Bloqueo de domo ID ${dome_id} del ${start_date} al ${end_date}`);
    res.json({ success: true, id: info.lastInsertRowid });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/maintenance/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { user_name } = req.body || {};
    const block = db.prepare(`SELECT * FROM maintenance_blocks WHERE id = ?`).get(id) as any;
    if (block) {
      db.prepare(`DELETE FROM maintenance_blocks WHERE id = ?`).run(id);
      db.prepare(`UPDATE domes SET status = 'Disponible' WHERE id = ?`).run(block.dome_id);
      logAudit(user_name || "Admin", "ELIMINAR_BLOQUEO", "Mantenimiento", id, `Eliminación de bloqueo para domo ID ${block.dome_id}`);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Availability Check
app.get("/api/availability", (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) {
      return res.status(400).json({ error: "Debe proporcionar checkIn y checkOut" });
    }

    const strCheckIn = String(checkIn);
    const strCheckOut = String(checkOut);

    const domes = db.prepare("SELECT * FROM domes WHERE status != 'Fuera de servicio'").all() as any[];
    
    const results = domes.map((dome) => {
      // Check active reservations overlap: newCheckIn < existingCheckOut AND newCheckOut > existingCheckIn
      const reservationOverlap = db.prepare(`
        SELECT COUNT(*) as count FROM reservations 
        WHERE dome_id = ? 
        AND status NOT IN ('Cancelada', 'Completada', 'No show')
        AND check_in < ? AND check_out > ?
      `).get(dome.id, strCheckOut, strCheckIn) as { count: number };

      // Check maintenance blocks overlap
      const maintenanceOverlap = db.prepare(`
        SELECT COUNT(*) as count FROM maintenance_blocks
        WHERE dome_id = ?
        AND start_date < ? AND end_date > ?
      `).get(dome.id, strCheckOut, strCheckIn) as { count: number };

      const isAvailable = reservationOverlap.count === 0 && maintenanceOverlap.count === 0 && dome.status === 'Disponible';

      return {
        ...dome,
        isAvailable,
        reason: !isAvailable ? (dome.status === 'Fuera de servicio' ? 'Fuera de servicio' : (maintenanceOverlap.count > 0 ? 'Mantenimiento' : 'Reservado')) : 'Disponible'
      };
    });

    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Reservations & Double Booking Prevention (Atomic Transaction)
app.get("/api/reservations", (req, res) => {
  try {
    const reservations = db.prepare(`
      r.*, c.name as customer_name, c.phone as customer_phone, c.email as customer_email, c.whatsapp as customer_whatsapp, d.name as dome_name, d.code as dome_code
      FROM reservations r
      JOIN customers c ON r.customer_id = c.id
      JOIN domes d ON r.dome_id = d.id
      ORDER BY r.created_at DESC
    `).all();
    res.json(reservations);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/reservations", (req, res) => {
  const { customer, dome_id, check_in, check_out, guests, total_amount, notes, user_name } = req.body;

  if (!customer || !customer.name || !dome_id || !check_in || !check_out || !total_amount) {
    return res.status(400).json({ error: "Faltan datos obligatorios para crear la reserva." });
  }

  // BEGIN TRANSACTION & SERIALIZABLE ISOLATION (or strict SQLite transaction lock)
  try {
    db.exec("BEGIN EXCLUSIVE TRANSACTION;");

    // 1. Check if dome is out of service or in maintenance
    const dome = db.prepare("SELECT * FROM domes WHERE id = ?").get(dome_id) as any;
    if (!dome || dome.status === 'Fuera de servicio') {
      db.exec("ROLLBACK;");
      return res.status(400).json({ error: "El domo seleccionado no está disponible o se encuentra fuera de servicio." });
    }

    // 2. Check for overlapping reservations: check_in < existingCheckOut AND check_out > existingCheckIn
    const overlap = db.prepare(`
      SELECT COUNT(*) as count FROM reservations 
      WHERE dome_id = ? 
      AND status NOT IN ('Cancelada', 'Completada', 'No show')
      AND check_in < ? AND check_out > ?
    `).get(dome_id, check_out, check_in) as { count: number };

    if (overlap.count > 0) {
      db.exec("ROLLBACK;");
      return res.status(409).json({ error: "Este domo ya no está disponible para las fechas seleccionadas. Por favor selecciona otro domo o modifica las fechas." });
    }

    // 3. Check maintenance blocks
    const maintOverlap = db.prepare(`
      SELECT COUNT(*) as count FROM maintenance_blocks
      WHERE dome_id = ? AND start_date < ? AND end_date > ?
    `).get(dome_id, check_out, check_in) as { count: number };

    if (maintOverlap.count > 0) {
      db.exec("ROLLBACK;");
      return res.status(409).json({ error: "El domo se encuentra bajo mantenimiento programado para estas fechas." });
    }

    // 4. Find or create customer
    let customerId: number;
    const existingCust = db.prepare("SELECT id FROM customers WHERE email = ? OR phone = ?").get(customer.email || '', customer.phone || '') as any;
    
    if (existingCust) {
      customerId = existingCust.id;
      db.prepare("UPDATE customers SET name = ?, phone = ?, whatsapp = ?, document_id = ? WHERE id = ?")
        .run(customer.name, customer.phone, customer.whatsapp || customer.phone, customer.document_id || '', customerId);
    } else {
      const custStmt = db.prepare("INSERT INTO customers (name, phone, whatsapp, email, document_id, notes) VALUES (?, ?, ?, ?, ?, ?)");
      const custInfo = custStmt.run(
        customer.name,
        customer.phone || '',
        customer.whatsapp || customer.phone || '',
        customer.email || '',
        customer.document_id || '',
        customer.notes || ''
      );
      customerId = Number(custInfo.lastInsertRowid);
    }

    // 5. Generate unique reservation code
    const randomCode = "EGC-" + Math.floor(1000 + Math.random() * 9000);

    // 6. Insert reservation
    const resStmt = db.prepare(`
      INSERT INTO reservations (
        reservation_code, customer_id, dome_id, check_in, check_out, guests, 
        status, payment_status, total_amount, amount_paid, amount_pending, notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, 'Pendiente', 'Pendiente', ?, 0, ?, ?, ?)
    `);

    const resInfo = resStmt.run(
      randomCode,
      customerId,
      dome_id,
      check_in,
      check_out,
      guests || 2,
      total_amount,
      total_amount,
      notes || '',
      user_name || customer.name || 'Portal Web'
    );

    db.exec("COMMIT;");

    logAudit(user_name || customer.name || 'Cliente', "CREAR_RESERVA", "Reserva", randomCode, `Reserva creada para Domo ID ${dome_id} (${check_in} al ${check_out})`);

    res.json({
      success: true,
      reservation_code: randomCode,
      reservation_id: resInfo.lastInsertRowid
    });

  } catch (err: any) {
    try { db.exec("ROLLBACK;"); } catch (e) {}
    console.error("Reservation transaction error:", err);
    res.status(500).json({ error: "Error interno procesando la reserva: " + err.message });
  }
});

app.put("/api/reservations/:id/status", (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_status, user_name } = req.body;
    
    let query = "UPDATE reservations SET updated_at = CURRENT_TIMESTAMP";
    const params: any[] = [];
    if (status) {
      query += ", status = ?";
      params.push(status);
    }
    if (payment_status) {
      query += ", payment_status = ?";
      params.push(payment_status);
    }
    if (user_name) {
      query += ", updated_by = ?";
      params.push(user_name);
    }
    query += " WHERE id = ?";
    params.push(id);

    db.prepare(query).run(...params);
    logAudit(user_name || "Admin", "ACTUALIZAR_ESTADO_RESERVA", "Reserva", id, `Nuevo estado: ${status || 'N/A'}, Pago: ${payment_status || 'N/A'}`);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/reservations/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { user_name } = req.body || {};
    db.prepare(`UPDATE reservations SET status = 'Cancelada', updated_by = ? WHERE id = ?`).run(user_name || 'Admin', id);
    logAudit(user_name || "Admin", "CANCELAR_RESERVA", "Reserva", id, `Reserva cancelada`);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Payments
app.get("/api/payments", (req, res) => {
  try {
    const payments = db.prepare(`
      p.*, r.reservation_code, c.name as customer_name
      FROM payments p
      JOIN reservations r ON p.reservation_id = r.id
      JOIN customers c ON r.customer_id = c.id
      ORDER BY p.created_at DESC
    `).all();
    res.json(payments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/payments", (req, res) => {
  try {
    const { reservation_id, amount, method, user_name } = req.body;
    
    db.exec("BEGIN TRANSACTION;");

    const payStmt = db.prepare(`INSERT INTO payments (reservation_id, amount, method, recorded_by) VALUES (?, ?, ?, ?)`);
    payStmt.run(reservation_id, amount, method, user_name || 'Admin');

    // Update reservation amounts
    const resRow = db.prepare(`SELECT total_amount, amount_paid FROM reservations WHERE id = ?`).get(reservation_id) as any;
    const newPaid = (resRow.amount_paid || 0) + Number(amount);
    const newPending = Math.max(0, resRow.total_amount - newPaid);
    const newPayStatus = newPending === 0 ? 'Pagado' : (newPaid > 0 ? 'Parcial' : 'Pendiente');

    db.prepare(`UPDATE reservations SET amount_paid = ?, amount_pending = ?, payment_status = ? WHERE id = ?`)
      .run(newPaid, newPending, newPayStatus, reservation_id);

    db.exec("COMMIT;");

    logAudit(user_name || "Admin", "REGISTRAR_PAGO", "Pago", String(reservation_id), `Pago registrado por $${amount} (${method})`);
    res.json({ success: true });
  } catch (err: any) {
    try { db.exec("ROLLBACK;"); } catch(e){}
    res.status(400).json({ error: err.message });
  }
});

// 6. Customers CRM
app.get("/api/customers", (req, res) => {
  try {
    const customers = db.prepare(`
      c.*, 
      COUNT(r.id) as total_reservations,
      COALESCE(SUM(r.total_amount), 0) as total_spent,
      MAX(r.created_at) as last_reservation
      FROM customers c
      LEFT JOIN reservations r ON c.id = r.customer_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `).all();
    res.json(customers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/customers/:id", (req, res) => {
  try {
    const { id } = req.params;
    const customer = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(id);
    if (!customer) return res.status(404).json({ error: "Cliente no encontrado" });

    const reservations = db.prepare(`
      r.*, d.name as dome_name
      FROM reservations r
      JOIN domes d ON r.dome_id = d.id
      WHERE r.customer_id = ?
      ORDER BY r.created_at DESC
    `).all(id);

    res.json({ customer, reservations });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Finances & Dashboard Metrics
app.get("/api/finances/summary", (req, res) => {
  try {
    const todayStr = new Date().toISOString().split("T")[0];
    const firstDayMonth = todayStr.substring(0, 8) + "01";
    const firstDayYear = todayStr.substring(0, 5) + "01-01";

    const todayRev = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM payments 
      WHERE date(created_at) = date('now')
    `).get() as { total: number };

    const weekRev = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM payments 
      WHERE created_at >= datetime('now', '-7 days')
    `).get() as { total: number };

    const monthRev = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM payments 
      WHERE created_at >= ?
    `).get(firstDayMonth + " 00:00:00") as { total: number };

    const yearRev = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM payments 
      WHERE created_at >= ?
    `).get(firstDayYear + " 00:00:00") as { total: number };

    const totalBooked = db.prepare(`SELECT COALESCE(SUM(total_amount), 0) as total FROM reservations WHERE status NOT IN ('Cancelada')`).get() as { total: number };
    const totalCollected = db.prepare(`SELECT COALESCE(SUM(amount), 0) as total FROM payments`).get() as { total: number };
    const totalPending = db.prepare(`SELECT COALESCE(SUM(amount_pending), 0) as total FROM reservations WHERE status NOT IN ('Cancelada')`).get() as { total: number };

    // Dashboard daily income chart data (last 7 days)
    const dailyChart = db.prepare(`
      SELECT date(created_at) as date, SUM(amount) as total 
      FROM payments 
      WHERE created_at >= datetime('now', '-7 days')
      GROUP BY date(created_at)
      ORDER BY date ASC
    `).all();

    res.json({
      todayRevenue: todayRev.total,
      weekRevenue: weekRev.total,
      monthRevenue: monthRev.total,
      yearRevenue: yearRev.total,
      totalBooked: totalBooked.total,
      totalCollected: totalCollected.total,
      totalPending: totalPending.total,
      dailyChart
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Dashboard metrics count
app.get("/api/dashboard/metrics", (req, res) => {
  try {
    const todayStr = new Date().toISOString().split("T")[0];

    const reservationsToday = db.prepare(`SELECT COUNT(*) as count FROM reservations WHERE date(created_at) = ?`).get(todayStr) as { count: number };
    const checkInsToday = db.prepare(`SELECT COUNT(*) as count FROM reservations WHERE check_in = ? AND status NOT IN ('Cancelada')`).get(todayStr) as { count: number };
    const checkOutsToday = db.prepare(`SELECT COUNT(*) as count FROM reservations WHERE check_out = ? AND status NOT IN ('Cancelada')`).get(todayStr) as { count: number };
    
    const totalDomes = db.prepare(`SELECT COUNT(*) as count FROM domes WHERE status != 'Fuera de servicio'`).get() as { count: number };
    const occupiedDomes = db.prepare(`
      SELECT COUNT(DISTINCT dome_id) as count FROM reservations 
      WHERE check_in <= ? AND check_out > ? AND status IN ('Confirmada', 'Check-in', 'Hospedado')
    `).get(todayStr, todayStr) as { count: number };

    const pendingReservations = db.prepare(`SELECT COUNT(*) as count FROM reservations WHERE status = 'Pendiente'`).get() as { count: number };
    const activeDomesList = db.prepare(`SELECT * FROM domes`).all();

    res.json({
      reservationsToday: reservationsToday.count,
      checkInsToday: checkInsToday.count,
      checkOutsToday: checkOutsToday.count,
      occupiedDomes: occupiedDomes.count,
      availableDomes: Math.max(0, totalDomes.count - occupiedDomes.count),
      pendingReservations: pendingReservations.count,
      activeDomesList
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Users & Authentication
app.get("/api/users", (req, res) => {
  try {
    const users = db.prepare(`SELECT id, username, full_name, email, role, status, created_at FROM users ORDER BY id ASC`).all();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/users", (req, res) => {
  try {
    const { username, password, full_name, email, role, status, user_name } = req.body;
    const stmt = db.prepare(`INSERT INTO users (username, password_hash, full_name, email, role, status) VALUES (?, ?, ?, ?, ?, ?)`);
    const info = stmt.run(username, password || 'admin123', full_name, email, role || 'ADMIN', status || 'Activo');
    logAudit(user_name || "SuperAdmin", "CREAR_USUARIO", "Usuario", String(info.lastInsertRowid), `Creación de administrador ${username} (${role})`);
    res.json({ success: true, id: info.lastInsertRowid });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/auth/login", (req, res) => {
  try {
    const { username, password } = req.body;
    const user = db.prepare(`SELECT * FROM users WHERE username = ? AND password_hash = ? AND status = 'Activo'`).get(username, password) as any;
    
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas o usuario inactivo." });
    }

    logAudit(user.full_name, "LOGIN", "Usuario", String(user.id), `Inicio de sesión exitoso (${user.role})`);
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Audit Logs
app.get("/api/audit", (req, res) => {
  try {
    const logs = db.prepare(`SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100`).all();
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Settings
app.get("/api/settings", (req, res) => {
  try {
    const rows = db.prepare(`SELECT * FROM settings`).all() as any[];
    const settings: Record<string, string> = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/settings", (req, res) => {
  try {
    const settings = req.body;
    const stmt = db.prepare(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`);
    for (const [key, value] of Object.entries(settings)) {
      stmt.run(key, String(value));
    }
    logAudit("Admin", "ACTUALIZAR_CONFIGURACION", "Configuracion", "settings", "Actualización de parámetros generales del glamping");
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 12. AI Concierge / Assistant (Gemini API)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    const systemInstruction = `Eres el Asistente Virtual Inteligente de "Eco Glamping Chinauta", un exclusivo centro de glamping ubicado en Chinauta / Fusagasugá, Cundinamarca, Colombia.
    Cuentas con 6 domos ecológicos de lujo: Huitaca, Bochica, Bachué, Luna Chía, Chiminichagua y Xue Sol.
    Ofreces experiencias de desconexión, naturaleza, jacuzzis privados, mallas de descanso, gastronomía local y avistamiento de estrellas.
    
    MENÚ CHINAUTA ECO GLAMPING (CENAS Y ALMUERZOS):
    #1 Trucha gratinada o en salsa de champiñones asada. Incluye papas a la francesa, ensalada y jugo natural ($38.000 COP).
    #2 Carne de res gratinada, ensalada de champiñones o asada. Incluye papas a la francesa, ensalada y jugo natural ($38.000 COP).
    #3 Cerdo en salsa de champiñones gratinado o asado. Incluye papa a la francesa, ensalada y jugo natural ($36.000 COP).
    #4 Pechuga asada o en salsa de champiñones o gratinada. Incluye papa a la francesa, ensalada y jugo natural ($34.000 COP).
    #5 Combo de hamburguesa artesanal. Incluye papa a la francesa y gaseosa Postobón de 400ml ($30.000 COP).

    Responde de forma amable, profesional, elegante y acogedora a los clientes, ayudándoles con información sobre tarifas, ubicación, clima, reservas, el menú gastronómico y servicios adicionales.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text || "" });
  } catch (err: any) {
    console.error("AI Chat error:", err);
    res.status(500).json({ reply: "Hola, soy el asistente virtual de Eco Glamping Chinauta. En este momento estoy experimentando alta concurrencia. Puedes escribirnos por WhatsApp al +57 310 1234567 para atenderte inmediatamente." });
  }
});

async function startServer() {
  // Vite middleware setup for development, or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Eco Glamping Chinauta server running on http://localhost:${PORT}`);
  });
}

startServer();
