const express = require("express");
const mysql = require("mysql8");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// Connect to MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Root",
    database: "school"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }

    console.log("Connected to MySQL");
});

// GET: All students
app.get("/students", (req, res) => {
    const sql = "SELECT * FROM students";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Fetch error:", err.message);
            return res.status(500).send(err.message);
        }

        res.json(result);
    });
});

// GET: One student
app.get("/students/:sno", (req, res) => {
    const sql = "SELECT * FROM students WHERE `student id` = ?";

    db.query(sql, [req.params.sno], (err, result) => {
        if (err) {
            console.error("Search error:", err.message);
            return res.status(500).send(err.message);
        }

        res.json(result);
    });
});

// POST: Add student
app.post("/students", (req, res) => {
    const { sno, name, studentClass, total } = req.body;

    const sql = `
        INSERT INTO students
        (\`student id\`, \`student name\`, \`class\`, \`total\`)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [sno, name, studentClass, total], (err, result) => {
        if (err) {
            console.error("Insert error:", err.message);
            return res.status(500).send(err.message);
        }

        res.status(201).json({
            message: "Student inserted successfully",
            studentId: sno
        });
    });
});

// PUT: Update student
app.put("/students/:sno", (req, res) => {
    const { name, studentClass, total } = req.body;

    const sql = `
        UPDATE students
        SET \`student name\` = ?, \`class\` = ?, \`total\` = ?
        WHERE \`student id\` = ?
    `;

    db.query(
        sql,
        [name, studentClass, total, req.params.sno],
        (err, result) => {
            if (err) {
                console.error("Update error:", err.message);
                return res.status(500).send(err.message);
            }

            if (result.affectedRows === 0) {
                return res.status(404).send("Student not found");
            }

            res.send("Student updated successfully");
        }
    );
});

// DELETE: Delete student
app.delete("/students/:sno", (req, res) => {
    const sql = "DELETE FROM students WHERE `student id` = ?";

    db.query(sql, [req.params.sno], (err, result) => {
        if (err) {
            console.error("Delete error:", err.message);
            return res.status(500).send(err.message);
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Student not found");
        }

        res.send("Student deleted successfully");
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});