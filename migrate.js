const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function migrate() {
    try {
        console.log('Starting database migration...');
        const sqlFilePath = path.join(__dirname, 'schema.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');

        // Split by semicolon, but ignore semicolons inside quotes/comments (simple split for now)
        const statements = sql.split(/;\s*$/m).filter(stmt => stmt.trim().length > 0);

        for (let stmt of statements) {
            if (stmt.trim()) {
                try {
                    await db.query(stmt);
                } catch (e) {
                    console.log(`Warning executing statement: ${e.message}`);
                }
            }
        }
        
        // Also ensure token_number for existing bookings that don't have one
        try {
            await db.query(`UPDATE bookings SET token_number = CONCAT('KITSW', FLOOR(1000 + RAND() * 9000)) WHERE token_number IS NULL OR token_number = ''`);
            console.log('Updated existing bookings with token numbers.');
        } catch (e) {
             console.log(`Warning updating tokens: ${e.message}`);
        }

        console.log('Migration completed.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
