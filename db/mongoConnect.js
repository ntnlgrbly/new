const mongoose = require('mongoose');

// אם יש טעות /אירור בשרת ידפיס בקונסול
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://natan11:avital148&&@cluster0.avz8s.mongodb.net/deds');
  // אם הצליח להתחבר יציג מונגו קוניקט
  console.log("mongo connect !ded")
}