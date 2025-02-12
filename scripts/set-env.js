const { writeFileSync } = require('fs');
const dotenv =  require('dotenv').config();

const envContent = Object.keys(dotenv.parsed).map( (value) => `${value}=`).join('\n')

writeFileSync('./.env.template',envContent);



