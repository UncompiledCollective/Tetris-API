const express = require("express");
const { createPool, createConnection } = require("mysql");
const dbOperations = require("./dbOperations.js");
const config = require("./dbconfig.js");
const sqlConnection = createPool(config);
var bodyParser = require('body-parser');
const parseMp = require('express-parse-multipart');
const songs = require('./songs/songsObj.js');
const cors = require("cors")
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
//const { EventEmitter } = require("events");
//const { readFileSync } = require("fs");
//const { readFile } = require("fs").promises;
//const testModule = require("./module.js");
//const test = new EventEmitter();
const app = express();
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.raw());
app.get("/get-songs-init", function (req, res) {
    new Promise(function (resolve, reject) {
        resolve(songs.songsObj.songs);
    }).then(function (value) {
        res.send(value);
    }).catch(function (error) {
        res.send(error);
    })
})
app.post("/get-songs-after", function (req, res) {
    new Promise(function (resolve, reject) {
        songs.sendMissing(req.body.value, songs.songsObj.songs, function (x) {
            resolve(x);
        })
    }).then(function (value) {
        if (value) {
            res.send(value);
        }
    }).then(function (value) {
        if (!value) {
            res.send(value);
        }
    }).catch(function (error) {
        res.send(error);
    })
})
app.get("/receive-file", function (req, res) {
    new Promise(function (resolve, reject) {
        sqlConnection.getConnection(function(err, connection){
            if (err) {
                reject(err)
            }
            connection.query("SELECT * FROM avatars;", function (error, response) {
                if (error) {
                    reject(error)
                }
                connection.release();
                resolve(response);
            })
        })
    }).then(function (value) {
        res.send(value)
    }).catch(function (error) {
        res.send(error);
    })
})
app.post("/receive-local", function (req, res) {
    new Promise(function (resolve, reject) {
        sqlConnection.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            }
            let temp = [req.body]
            connection.query("SELECT * FROM avatars WHERE avatar_id IN ?", [temp], function (error, result) {
                if (error) {
                    reject(error);
                };
                connection.release();
                resolve(result);
            });
        });
    }).then(function (value) {
        res.send(value);
    }).catch(function (value) {
        res.send(value);
    })
})
app.post("/post-file", parseMp, function (req, res) {
    new Promise(function (resolve, reject) {
        sqlConnection.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                let file = req.formData[0].data;
                connection.query("INSERT INTO avatars SET ?", { avatar_file: file }, function (error, result) {
                    if (error) {
                        reject(error)
                    } else {
                        connection.release();
                        let temp = { value: result.insertId }
                        resolve(temp)
                    }
                })
            }
        })
    }).then(function (value) {
        res.send(value);    
    }).catch(function (error) {
        res.send(error);
    })
},



)
app.post("/new-score", function (req, res, next) {
    new Promise(function (resolve, reject) {
        sqlConnection.getConnection(function (error, connection) {
            if (error) {
                reject(error)
            } else {
                let temp = Object.values(req.body);
                if (temp[0] === 0) {
                    reject("Score 0 is insufficient.");
                }
                let temp2 = [temp];
                connection.query("INSERT INTO score (Score, lines_4, lines_3, lines_2, lines_1, lines_total, name, avatar_id ) VALUES ?", [temp2], function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    connection.release();
                    resolve("");
                })
            }
        })
    }).then(function (value) {
        next()
    }).catch(function (error) {
        res.send(error);
    })
    
}, function (req, res, next) {
    new Promise(function (resolve, reject) {
        sqlConnection.getConnection(function (error, connection) {
            if (error) {
                reject(error)
            }
            connection.query("SELECT * FROM score ORDER BY Score DESC, lines_total ASC;", function (err, result) {
                if (err) {
                    reject(err);
                }
                if (result.length > 40) {
                    let temp = result.length - 40;
                    connection.query("DELETE FROM score ORDER BY Score ASC, lines_total DESC limit ?;", [temp], function (error2, result2) {
                        if (error2) {
                            reject(error2)
                        }
                        //console.log(`deletion successful, number of affected rows: ${result2.affectedRows}`)
                        connection.release()
                        resolve("");
                    })
                } else {
                    //console.log("no need to remove a row.")
                    connection.release();
                    resolve("")
                }
            })
        })
    }).then(function (value) {
        next();
    }).catch(function (error) {
        res.send(error);
    })
},
    function (req, res) {
        new Promise(function (resolve, reject) {
            sqlConnection.getConnection(function (error, connection) {
                if (error) {
                    reject(error)
                }       
                connection.query("SELECT * FROM score ORDER BY Score DESC, lines_total ASC;", function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    dbOperations.findIndex(result, req.body, function (number) {

                        let response = { value: number }
                        resolve(response);
                    })
                    connection.release();
                })
            })
        }).then(function (value) {
            res.send(value);
        }).catch(function (error) {
            res.send(error);
        })
    }
)
app.post("/sort-test", function (req, res) {
    new Promise(function (resolve, reject) {
        sqlConnection.getConnection(function (error, connection) {
            if (error) {
                reject(error)
            }
            connection.query("SELECT * FROM score ORDER BY Score DESC, lines_total ASC;", function (err, result) {
                if (err) {
                    reject(err);
                }
                dbOperations.findIndex(result, req.body, function (number) {
                    let response = {value: number}
                    resolve(response);
                })
            })
        })
    }).then(function (value) {
        res.send(value);
    }).catch(function (error) {
        res.send(error);
    })
})

app.post("/delete-test", function (req, res) {
    new Promise(function (resolve, reject) {
        sqlConnection.getConnection(function (error, connection) {
            if (error) {
                reject(error)
            }
            if (!connection) {
                reject(error);
            }
            connection.query("SELECT * FROM score ORDER BY Score DESC, lines_total ASC;", function (err, result) {
                if (err) {
                    reject(err);
                }
                if (result.length > 10) {
                    let temp = result.length - 10;
                    connection.query("DELETE FROM score ORDER BY Score ASC, lines_total DESC limit ?;", [temp], function (error2, result2) {
                        resolve(`deletion successful, number of affected rows: ${result2.affectedRows}`);
                    })
                } else {
                    resolve("no need to remove a row.")
                }
            })
        })
    }).then(function (value) {
        res.send(value);
    }).catch(function (error) {
        res.send(error);
    })
})
app.get("/send-scores", function (req, res) {
    new Promise(function (resolve, reject) {
        sqlConnection.getConnection(function (error, connection) {
            if (error) {
                reject(error)
            }
            if (!connection) {
                reject(error);
            }
            connection.query("SELECT * FROM score ORDER BY Score DESC, lines_total ASC;", function (err, result) {
                if (err) {
                    reject(err);
                }
                connection.release();
                resolve(result);
            })
        })
    }).then(function (value) {
        res.send(value);
    }).catch(function (error){
        res.send(error);
    })
})
app.post("/get-all-avatars", function (req, res) {
    new Promise(function (resolve, reject) {
        sqlConnection.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            }
            connection.query("SELECT * FROM avatars WHERE avatar_id > 6 ORDER BY avatar_id ASC; ", function (error, result) {
                if (error) {
                    reject(error);
                }
                if (req.body.length === 0) {
                    resolve(result);
                }
                dbOperations.filterSame(req.body, result, function (x) {
                    // this function filters avatars already in possesion of client. It makes it so no duplicates are ever sent to client.
                    connection.release();
                    resolve(x);
                })
            })
        })
    }).then(function (value) {
        res.send(value);
    }).catch(function (error) {
        res.send(error);
    })
})
app.listen(process.env.PORT || 5000, () => console.log("server started on port", process.env.PORT ? process.env.PORT : 5000));
