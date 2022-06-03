// required those from nodeJs
const http = require("http");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");

// creating server using http
http.createServer((req, res) => {
    const url = req.url;
    const method = req.method.toLowerCase();
    if (url === "/" && method === "get") {
        const indexFile = fs.readFileSync("./index.html");
        res.writeHead(200, { "content-type": "text/html" });
        res.write(indexFile);
        res.end();
    } else if (url === "/process" && method === "post") {
        const form = new formidable.IncomingForm();
        form.parse(req, (err,fields,files) => {
            if (err) {
                res.end(err)
            } else {
                // create directory for each user.
                /* fs.mkdir(`./UsersData/${fields.email}`, (err) => {
                    // if (err) throw err;
                    if (err) {
                        console.log(err.message);
                    } else {
                        console.log("Folder created successfully....!");
                    }
                })  */
                // create directory for each user and path.join() method used here for every os support.
                fs.mkdir(path.join("UsersData",`${fields.email}`), (err) => {
                    // if (err) throw err;
                    if (err) {
                        console.log(err.message);
                    } else {
                        console.log("Folder created successfully....!");
                    }
                }) 
                // writing users data to a JSON file by writeFileSync().

                //using direct name of directory to save date.
                /* fs.writeFileSync(`./UsersData/${fields.email}/${fields.fName}.json`, JSON.stringify(fields)); */

                // using path.join() method to save data in proper directory for every os support.
                fs.writeFileSync(path.join("UsersData",`${fields.email}`,`${fields.fName}.json`), JSON.stringify(fields));
                const fileName = files.photo.originalFilename;
                const tempPath = files.photo.filepath;
                // renaming and move image from temp file to server's directory.
                fs.renameSync(tempPath, path.join(__dirname, "UsersData", `${fields.email}`, fileName))
                res.end("Thanks to submit your data.")
            }
        })

        // manual way to handle data from form.
        /*req.on("data", (chunk) => {
            console.log(chunk);
        });
        req.on("end", () => {
            res.end("Thanks to submit your data.");
        }); */
        
}
}).listen(2000, () => {
    console.log("Server running at 2000 port.");
})