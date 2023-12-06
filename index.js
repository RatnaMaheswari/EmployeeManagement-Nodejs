const http = require('http');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
let dataResponse;
let DB_NAME = "employeemanagementDatabase";
let COLLECTION_NAME = "employeemanagement"
async function main() {
    const uri = `mongodb+srv://priyanidamanuri35:Venkatarao359@cluster0.fhqukpv.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
    const client = new MongoClient(uri);
    try {
        await client.connect();
    } finally {
        await client.close();
    }
}


main().catch(console.error);

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (req.url === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });    
        const uri = `mongodb+srv://priyanidamanuri35:Venkatarao359@cluster0.fhqukpv.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
        const client = new MongoClient(uri);
        try {
            await client.connect();
            dataResponse = await getTheDataFromDatabase(client)
            res.end(JSON.stringify(dataResponse))
        } finally {
            await client.close();
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(" <h1> 404 Nothing Found </h1>")
    }
});

async function getTheDataFromDatabase(client) {
    const cursor = client.db(DB_NAME).collection(COLLECTION_NAME)
        .find();
    const results = await cursor.toArray();
    if (results.length > 0) {
        return results;
    } else {}
}
const PORT = process.env.PORT || 4186;
server.listen(PORT, () => console.log(` My Server is running on port: ${PORT}`));
