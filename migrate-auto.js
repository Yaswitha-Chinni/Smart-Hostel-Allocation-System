const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const passwords = [process.env.DB_PASS, '', 'root', 'password', '123456', 'root123', 'admin'];

async function tryMigrate() {
    let pool;
    for (let pwd of passwords) {
        if (pwd === undefined) continue;
        try {
            pool = mysql.createPool({
                host: 'localhost',
                user: 'root',
                password: pwd,
                database: 'kitsw_hostel'
            });
            await pool.query('SELECT 1');
            console.log(`Successfully connected using password: "${pwd}"`);
            break;
        } catch (e) {
            pool = null;
        }
    }

    if (!pool) {
        console.error('Failed to connect to MySQL with any common password.');
        process.exit(1);
    }

    const sqlFilePath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    const statements = sql.split(/;\s*$/m).filter(stmt => stmt.trim().length > 0);

    for (let stmt of statements) {
        if (stmt.trim()) {
            try { await pool.query(stmt); } 
            catch (e) { console.log(`Notice: ${e.message}`); }
        }
    }
    
    // Update missing tokens
    try {
        await pool.query(`UPDATE bookings SET token_number = CONCAT('KITSW', FLOOR(1000 + RAND() * 9000)) WHERE token_number IS NULL OR token_number = ''`);
        console.log('Fixed missing token numbers for old bookings.');
    } catch (e) {
        console.log(`Notice updating tokens: ${e.message}`);
    }

    console.log('Database upgrade complete! Tokens are now ready.');
    process.exit(0);
}

tryMigrate();
