const express = require("express");
require("dotenv").config({ path: __dirname + "/.env" });
const mysql = require("mysql2");
var app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session")({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
});
const passport = require("passport");
const { format } = require("util");

const jwt = require("jsonwebtoken");
const expressFileUpload = require("express-fileupload");
const xlsx = require("xlsx");
const path = require("path");
const { Storage } = require("@google-cloud/storage");

// var https = require("https");
// var csrf = require('csurf')
// const expressjwt = require('express-jwt');

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyparser.json());

const gc = new Storage({
  keyFilename: path.join(
    __dirname,
    "../wired-archery-290922-8a9914567a23.json"
  ),
  projectId: "wired-archery-290922",
});

const googleCloudBucketName = gc.bucket("studentimages");

app.use(
  cors({
    origin: [
      "http://localhost/",
      "http://localhost:8080/",
      "http://localhost:8080/api/",
      "http://34.64.137.252/",
      "http://34.64.71.219/",
      "https://johnreyes.xyz/",
      "http://34.64.137.252/class",
      "http://localhost/api/getStudentName",
    ],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(expressSession);
app.use(expressFileUpload());

app.use(express.static(path.resolve(__dirname + "../../dist")));

var mysqlConnection = mysql.createConnection({
  host: process.env.host_name,
  user: process.env.myuser,
  password: process.env.mypassword,
  database: process.env.mydatabase,
  multipleStatements: true,
});

function ReConnectionToServer() {
  mysqlConnection = mysql.createConnection({
    host: process.env.host_name,
    user: process.env.myuser,
    password: process.env.mypassword,
    database: process.env.mydatabase,
    multipleStatements: true,
  });
} 

mysqlConnection.connect((err) => {
  if (!err) console.log("DB connection succeded.");
  else
    console.log(
      "DB connection failed \n Error : " + JSON.stringify(err, undefined, 2)
    );
});

app.listen(80, "0.0.0.0", () => console.log(`Express server is running`));

app.post("/api/add", authenticateToken, (req, res) => {
  jwt.verify(req.token, process.env.secret_password, (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      mysqlConnection.query(
        "INSERT INTO school.jobs (`schoolname`, `schoollocation`, `schoolemail`, `schooldescription`) VALUES (?, ?, ?, ?);",
        [
          req.body.schoolName,
          req.body.schoolLocation,
          req.body.schoolEmail,
          req.body.schoolDescription,
        ],
        (err) => {
          if (!err) res.send("added successfully.");
          else console.log(err);
        }
      );
    }
  });
});

app.post("/api/registerbyfile", authenticateToken, (req, res) => {
  jwt.verify(req.token, process.env.secret_password, (err) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    if (err) {
      res.sendStatus(403);
    } else {
      console.log("here");
      if (req.files.myfile) {
        var workbook = xlsx.read(req.files.myfile.data, { type: "buffer" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        console.log(xlsx.utils.sheet_to_json(worksheet));
        let filename = req.files.myfile.name.match(/^\w+/g, "");
        for (var i = 0; i < xlsx.utils.sheet_to_json(worksheet).length; i++) {
          var obj = xlsx.utils.sheet_to_json(worksheet)[i];

          mysqlConnection.query(
            "INSERT INTO school.users (`name`, `username`, `userpassword`, `classname`) VALUES (?, ?, ?, ?);",
            [obj.name, obj.username, obj.password, filename],
            (err) => {
              if (err) console.log(err);
            }
          );
        }
        res.status(200).redirect(process.env.website_name + "/Class");
      }
    }
  });
});

app.post("/api/studentUploadImages", authenticateToken, (req, res, next) => {
  jwt.verify(req.token, process.env.secret_password, (err) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    if (err) {
      res.sendStatus(403);
    } else {
      if (req.files.myfile) {
        if (req.files.myfile.length > 1) {
          for (var i = 0; i < req.files.myfile.length; i++) {
            const blob = googleCloudBucketName.file(req.files.myfile[i].name);
            const blobStream = blob.createWriteStream();

            blobStream.on("error", (err) => {
              next(err);
            });

            let publicUrl = "";
            blobStream.on("finish", () => {
              // The public URL can be used to directly access the file via HTTP.
              publicUrl = format(
                `https://storage.googleapis.com/${googleCloudBucketName.name}/${blob.name}`
              );

              // const studentID = getTokenInfo(req.cookies.jwt);
              // console.log(studentID);

              const studentInfo = jwt.decode(req.cookies.jwt);
              mysqlConnection.query(
                "INSERT INTO school.student_images (`student_image_url`, `unit_number`, `users_id`) VALUES (?, ?, ?);",
                [publicUrl, 1, studentInfo.id],
                (err) => {
                  if (err) console.log(err);
                }
              );
              // res.status(200).redirect("http://localhost:8080");
            });

            blobStream.end(req.files.myfile[i].data);
          }
        } else {
          const blob = googleCloudBucketName.file(req.files.myfile.name);
          const blobStream = blob.createWriteStream();

          blobStream.on("error", (err) => {
            next(err);
          });

          let publicUrl = "";
          blobStream.on("finish", () => {
            // The public URL can be used to directly access the file via HTTP.
            let filename = blob.name.replace(/\s+/g, "");
            publicUrl = format(
              `https://storage.googleapis.com/${googleCloudBucketName.name}/${filename}`
            );

            // const studentID = getTokenInfo(req.cookies.jwt);
            // console.log(studentID);

            const studentInfo = jwt.decode(req.cookies.jwt);
            mysqlConnection.query(
              "INSERT INTO school.student_images (`student_image_url`, `unit_number`, `users_id`) VALUES (?, ?, ?);",
              [publicUrl, 1, studentInfo.id],
              (err) => {
                if (err) console.log(err);
              }
            );
            // res.status(200).redirect("http://localhost:8080");
          });

          blobStream.end(req.files.myfile.data);
        }

        // res.status(200).redirect("http://localhost:8080");
        res.status(200).redirect(process.env.website_name + "/StudentPage");
      }
    }
  });
});

app.post("/api/registerManually", authenticateToken, (req, res) => {
  jwt.verify(req.token, process.env.secret_password, (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      mysqlConnection.query(
        "INSERT INTO school.users (`name`, `username`, `userpassword`) VALUES (?, ?, ?);",
        [req.body.name, req.body.username, req.body.userpassword],
        (err) => {
          if (err) console.log(err);
        }
      );
    }
    res.status(200).redirect(process.env.website_name);
    // res.status(200).redirect("http://34.64.137.252/");
  });
});

app.get("/api/get/:id", authenticateToken, (req, res) => {
  const studentInfo = jwt.decode(req.cookies.jwt);
  jwt.verify(req.token, process.env.secret_password, (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      mysqlConnection.query(
        "SELECT * FROM school.jobs WHERE users_id = ?;",
        [studentInfo.id],
        (err, rows) => {
          if (rows === undefined) {
            res.send("Hello World!");
          } else {
            res.send(rows);
          }
        }
      );
    }
  });
});

app.get("/api/get", authenticateToken, (req, res) => {
  // var id = req.param("id");
  jwt.verify(req.token, process.env.secret_password, (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      mysqlConnection.query(
        "SELECT * FROM school.jobs;",

        (err, rows) => {
          if (rows === undefined) {
            res.send("Hello World!");
          } else {
            res.send(rows);
          }
        }
      );
    }
  });
});

// app.get("/api/getStudentName", authenticateToken, (req, res) => {
//   jwt.verify(req.token, process.env.secret_password, (err) => {
//     if (err) {
//       res.sendStatus(403);
//     } else {
//       mysqlConnection.query(
//         "SELECT * FROM school.users left JOIN school.student_audios on school.users.users_id = school.student_audios.users_id WHERE school.users.classname = ? AND (school.student_audios.unit_number = ? OR  school.student_audios.unit_number is null)",
//         [req.query.className, req.query.unitNumber],

//         (err, rows) => {
//           if (rows === undefined) {
//             res.send("Hello World!");
//           } else {
//             res.send(rows);
//           }
//         }
//       );
//     }
//   });
// });

app.get("/api/getStudentName", authenticateToken, (req, res) => {
  jwt.verify(req.token, process.env.secret_password, (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      mysqlConnection.query(
        "SELECT * FROM school.users WHERE school.users.classname = ?",
        [req.query.className],

        (err, rows) => {
          if (rows === undefined) {
            res.send("Hello World!");
          } else {
            res.send(rows);
          }
        }
      );
    }
  });
});

app.get("/api/checkIfStudentFinished", authenticateToken, (req, res) => {
  jwt.verify(req.token, process.env.secret_password, (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      mysqlConnection.query(
        "SELECT school.users.name  FROM school.users left JOIN school.student_audios on school.users.users_id = school.student_audios.users_id WHERE school.users.classname = ? AND school.student_audios.unit_number = ? group by school.users.name",
        [req.query.className, req.query.unitNumber],

        (err, rows) => {
          if (rows === undefined) {
            res.send("Hello World!");
          } else {
            res.send(rows);
          }
        }
      );
    }
  });
});

app.get("/api/getStudentImages", authenticateToken, (req, res) => {
  const studentInfo = jwt.decode(req.cookies.jwt);
  jwt.verify(req.token, process.env.secret_password, (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      mysqlConnection.query(
        "SELECT * FROM school.student_images where users_id = ? and unit_number = ?;",
        [studentInfo.id, 1],
        (err, rows) => {
          if (rows === undefined) {
            res.send("Hello World!");
          } else {
            res.send(rows);
          }
        }
      );
    }
  });
});

app.get("/api/getStudentAudio", authenticateToken, (req, res) => {
  jwt.verify(req.token, process.env.secret_password, (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      mysqlConnection.query(
        "SELECT * FROM school.student_audios where users_id = ? and unit_number = ?;",
        [req.query.usersID, req.query.unitNumber],
        (err, rows) => {
          if (rows === undefined) {
            res.send("Hello World!");
          } else {
            res.send(rows);
          }
        }
      );
    }
  });
});

app.get("/api/getAllUnitStudentAudio", authenticateToken, (req, res) => {
  jwt.verify(req.token, process.env.secret_password, (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      mysqlConnection.query(
        "SELECT * FROM school.student_audios where users_id = ?;",
        [req.query.usersID],
        (err, rows) => {
          if (rows === undefined) {
            res.send("Hello World!");
          } else {
            res.send(rows);
          }
        }
      );
    }
  });
});

app.post("/api/studentUploadAudio/", authenticateToken, (req, res, next) => {
  jwt.verify(req.token, process.env.secret_password, (err) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    if (err) {
      res.sendStatus(403);
    } else {
      if (req.files.myfile) {
        const studentInfo = jwt.decode(req.cookies.jwt);
        req.files.myfile.name =
          studentInfo.name +
          " - " +
          "unit = " +
          req.body.selectedValue +
          " - " +
          req.files.myfile.name;
        const blob = googleCloudBucketName.file(req.files.myfile.name);
        const blobStream = blob.createWriteStream();

        blobStream.on("error", (err) => {
          next(err);
        });

        let publicUrl = "";
        blobStream.on("finish", () => {
          publicUrl = format(
            `https://storage.googleapis.com/${googleCloudBucketName.name}/${blob.name}`
          );

          const studentInfo = jwt.decode(req.cookies.jwt);
          mysqlConnection.query(
            "INSERT INTO school.student_audios (`student_audios_url`, `unit_number`, `users_id`) VALUES (?, ?, ?);",
            [publicUrl, req.body.selectedValue, studentInfo.id],
            (err) => {
              if (err) console.log(err);
            }
          );
          // res.status(200).redirect("http://localhost:8080");
        });

        blobStream.end(req.files.myfile.data);

        // res.status(200).redirect(process.env.website_name + "/Congratulations/" +publicUrl);
        res
          .status(200)
          .redirect(
            process.env.website_name + "/Congratulations/" + `${blob.name}`
          );

        // res.status(200).redirect("http://34.64.137.252/StudentPage");
      }
    }
  });
});

app.post("/api/deleteAudioFile", authenticateToken, (req, res) => {
  jwt.verify(req.token, process.env.secret_password, (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      // let getFileName = req.query.filename.match(/[^/]+$/g);
      googleCloudBucketName.file(req.body.filename).delete();

      // const studentInfo = jwt.decode(req.cookies.jwt);

      mysqlConnection.query(
        "DELETE FROM school.student_audios WHERE student_audios_id = ?;",
        [req.body.audioID],
        (err) => {
          if (err) console.log(err);
        }
      );

      res.status(200).redirect(process.env.website_name + "/StudentPage");
      // res.status(200).redirect("http://34.64.137.252/StudentPage");
    }
  });
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, userpassword } = req.body;

    if(mysqlConnection.state === 'disconnected' || mysqlConnection.state === undefined){
      ReConnectionToServer();
      // setTimeout(() => { ReConnectionToServer(); }, 2000);
    }

    mysqlConnection.query(
      "SELECT * FROM school.users WHERE username = ? and userpassword = ?",
      [username, userpassword],
      async (error, results) => {
        const id = results[0].users_id;
        const name = results[0].name;
        const classname = results[0].classname;

        const token = jwt.sign(
          { id, name, classname },
          process.env.secret_password,
          {
            expiresIn: "1d",
          }
        );

        const cookieOptions = {
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          secure: false,
          httpOnly: false,
        };

        res.cookie("jwt", token, cookieOptions);
        // const studentInfo = jwt.decode(req.cookies.jwt);

        if (classname == "admin")
          res.status(200).redirect(process.env.website_name + "/Class");
        else
          res.status(200).redirect(process.env.website_name + "/StudentPage");
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/delete/:id", (req, res) => {
  mysqlConnection.query(
    "DELETE FROM school.jobs WHERE jobs_id = ?",
    [req.params.id],
    (err) => {
      if (!err) res.send("Deleted successfully.");
      else console.log(err);
    }
  );
});

// function previewFiles(e) {
//   var files = e,
//     f = files[0];
//   var reader = new FileReader();
//   reader.onload = function(e) {
//     var data = new Uint8Array(e.target.result);
//     var workbook = XLSX.read(data, { type: "array" });
//     let sheetName = workbook.SheetNames[0];
//     /* DO SOMETHING WITH workbook HERE */
//     console.log(workbook);
//     let worksheet = workbook.Sheets[sheetName];
//     console.log(XLSX.utils.sheet_to_json(worksheet));
//   };
//   reader.readAsArrayBuffer(f);
// }
app.get("/*", (req, res) =>
  res.sendFile(path.resolve(__dirname + "../../dist/index.html"))
);

function authenticateToken(req, res, next) {
  const bearerHeader = req.cookies.jwt;
  if (typeof bearerHeader !== "undefined") {
    req.token = bearerHeader;

    next();
  } else {
    res.sendStatus(403);
  }
}

// function getTokenInfo(token) {
//   try {
//     // const base64Url = token.split(".")[1];
//     // const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     // const buff = new Buffer(base64, "base64");
//     // const payloadinit = buff.toString("ascii");
//     // const payload = JSON.parse(payloadinit);
//     // const payload = JSON.stringify(payloadinit);
//     const header = jwt.decode(token)
//     console.log(header);
//     return header;
//   } catch (error) {
//     console.log(error);
//   }
// }
