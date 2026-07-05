-- Run these on PythonAnywhere Bash console:
-- cd ~/ems/backend && source ~/ems/venv/bin/activate

-- Add is_read column to notifications table (if not exists)
python3 -c "
import sqlite3
conn = sqlite3.connect('coderithm_events.db')
c = conn.cursor()
try:
    c.execute('ALTER TABLE notifications ADD COLUMN is_read BOOLEAN DEFAULT 0')
    print('Added is_read column')
except:
    print('is_read column already exists')
try:
    c.execute('ALTER TABLE users ADD COLUMN bio VARCHAR(500)')
    c.execute('ALTER TABLE users ADD COLUMN linkedin_url VARCHAR(500)')
    c.execute('ALTER TABLE users ADD COLUMN github_url VARCHAR(500)')
    c.execute('ALTER TABLE users ADD COLUMN portfolio_url VARCHAR(500)')
    print('Added profile columns')
except:
    print('Profile columns already exist')
conn.commit()
conn.close()
print('Migration complete')
"
