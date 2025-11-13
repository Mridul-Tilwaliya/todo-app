/**
 * Helper script to update .env file with MongoDB connection string
 * Usage: node update-env.js "your-connection-string"
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env');

function updateEnvFile() {
  console.log('\n📝 MongoDB Atlas Connection String Setup\n');
  console.log('Please provide the following information:\n');

  rl.question('1. MongoDB Connection String (mongodb+srv://...): ', (mongodbUri) => {
    if (!mongodbUri || mongodbUri.trim() === '') {
      console.log('❌ MongoDB URI is required!');
      rl.close();
      return;
    }

    rl.question('2. JWT Secret (or press Enter for default): ', (jwtSecret) => {
      if (!jwtSecret || jwtSecret.trim() === '') {
        jwtSecret = 'dev-secret-key-' + Math.random().toString(36).substring(2, 15);
        console.log(`   Using generated secret: ${jwtSecret}`);
      }

      rl.question('3. Email (Gmail) for password reset (optional, press Enter to skip): ', (email) => {
        rl.question('4. Gmail App Password (optional, press Enter to skip): ', (emailPassword) => {
          // Read existing .env file
          let envContent = '';
          if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
          } else {
            // Create from template
            envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection String
MONGODB_URI=your_mongodb_atlas_connection_string_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password

# Client URL (for CORS and email links)
CLIENT_URL=http://localhost:5173
`;
          }

          // Update values
          envContent = envContent.replace(
            /MONGODB_URI=.*/,
            `MONGODB_URI=${mongodbUri.trim()}`
          );
          envContent = envContent.replace(
            /JWT_SECRET=.*/,
            `JWT_SECRET=${jwtSecret.trim()}`
          );

          if (email && email.trim() !== '') {
            envContent = envContent.replace(
              /EMAIL_USER=.*/,
              `EMAIL_USER=${email.trim()}`
            );
          }

          if (emailPassword && emailPassword.trim() !== '') {
            envContent = envContent.replace(
              /EMAIL_APP_PASSWORD=.*/,
              `EMAIL_APP_PASSWORD=${emailPassword.trim()}`
            );
          }

          // Write updated .env file
          fs.writeFileSync(envPath, envContent, 'utf8');

          console.log('\n✅ .env file updated successfully!');
          console.log('\n📋 Summary:');
          console.log(`   MongoDB URI: ${mongodbUri.substring(0, 30)}...`);
          console.log(`   JWT Secret: ${jwtSecret.substring(0, 20)}...`);
          if (email) console.log(`   Email: ${email}`);
          console.log('\n🚀 You can now start your server with: npm run dev\n');

          rl.close();
        });
      });
    });
  });
}

// Check if .env exists
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found. Creating new one...\n');
}

updateEnvFile();

