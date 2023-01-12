const { Router } = require("express");
const express = require("express");
const app = express();
// const hbs = require("hbs");
const conn = require("./conn").con;
const path = require('path');
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "hbs");
app.set("/views", express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
    res.render("index")
});
// app.get("/home",(req,res)=>{
//     res.render("home")
// });
app.get("/about", (req, res) => {
    res.render("about")
});
app.get("/admin", (req, res) => {
    res.render("admin")
});
app.get("/contact", (req, res) => {
    res.render("contact")
});
app.get("/login", (req, res) => {
    res.render("login")
});
app.get("/adminlogin", (req, res) => {
    res.render("adminlogin")
});


app.get("/Registration", (req, res) => {
    res.render("Registration")
    // let qry1 = "select * from registration";
    // conn.query(qry1, (err,results) =>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.render("Registration",{data:results});
    //     }
    // })
});

app.get("/reg", (req, res) => {
    //fetching data from form
    const { name, BOD, gender, age, mno, occupation, email, username, password } = req.query
    let qry = "select * from registration where email=? or mno=?";
    conn.query(qry, [email, mno], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            if (results.length > 0) {
                res.render("Registration", { checkmesg: true })
            } else {
                //insert query
                let qry2 = "insert into registration values(?,?,?,?,?,?,?,?,?)";
                conn.query(qry2, [name, BOD, gender, age, mno, occupation, email, username, password], (err, results) => {
                    if (!err) {
                        res.render("Registration", { mesg: true })
                    }
                    else {
                        console.log(err);
                    }
                })
            }
        }
    })
});

app.get('/loginuser', (req, res) => {
    const { email, password,idcust } = req.query
    let qry = "select * from registration where email=?";
    conn.query(qry, [email], (err, results) => {
        if (err) {
            console.log(err);
        }
        else if (results.length > 0) {
            let qry1 = "select * from registration where email=? and password=?";
            conn.query(qry1, [email, password], (err, results) => {
                if (err) {
                    console.log(err);
                }
                else if (results.length > 0) {
                    let qry2 = "select * from dailymilk where idcust=?";
                    conn.query(qry2,[idcust],(err,data)=>{
                        if(!err){
                            res.render("postuserlogin",{milkrate: 35, list: data});
                        }
                        else{
                            console.log(err);
                        }
                    })
                }
                else {
                    res.render("login", { mesg1: true })
                }
            })
        }
        else {
            res.render('login', { mesg: true })
        }


    })
})
app.get("/canclecollection",async(req,res)=>{
    try{
        const {idcust,email,password} = req.query;
        let qry = "insert into cancle values(?,?,?)";
        conn.query(qry,[idcust,email,password],(err,result)=>{
            if(err){
                console.log(err);
            }
        })
    } catch(err){
        console.log(err);
    }
})
app.post('/adminlogin', async (req, res) => {
    try {
        const { email, pass, id } = req.query
        let qry = "select * from admin where email=? and pass=?";
        conn.query(qry, [email, pass], (err, results) => {
            if (!err) {
                let qry1 = "select * from admin where id=?";
                conn.query(qry1, [id], (err, results) => {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        let qry2 = "select * from registration";
                        conn.query(qry2, (err, result) => {
                            let qry3 = "select * from customer";
                            conn.query(qry3, (err, data) => {
                                let qry4 = "select * from canclecust";
                                conn.query(qry4,(err,datas)=>{
                                    if (!err) {
                                        res.render("adminside", { milkrate: 35,requestlist: result, custlist: data, canclelist: datas })
                                    }
                                    else {
                                        console.log(err);
                                    }
                                })
                            })

                        })
                    }
                })
            }
            else {
                console.log(err);
            }
        })

    } catch (err) {
        console.log(err);
    }
})
app.get('/cancle/:email',async(req,res)=>{
    try{
        const email = req.params.email;
        let qry = "select * from registration where email=?";
        conn.query(qry,[email],(err,result)=>{
            if(!err){
                let qry1 = "delete from registration where email=?";
                conn.query(qry1,[email],(err,result)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.render("index");
                    }
                })

            }
        })
    } catch(err){
        console.log(err);
    }
})
app.get('/cancle/:id',async(req,res)=>{
    try{
        const id = req.params.id;
        let qry = "select * from customer where idcust=?";
        conn.query(qry,[id],(err,result)=>{
            if(!err){
                let qry1 = "delete from customer where idcust=?";
                conn.query(qry1,[id],(err,result)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.render("index");
                    }
                })

            }
        })
    } catch(err){
        console.log(err);
    }
})
app.get('/delete/:email', async (req, res) => {
    try {
        const email = req.params.email;
        let qry = "delete from registration where email=?";
        conn.query(qry, [email], (err, results) => {
            if (!err) {
                res.send("deleted");
            }
            else {
                console.log(err);
            }
        })
    } catch (err) {
        console.log(err);
    }
})
app.get("/accept/:email", async (req, res) => {
    try {
        const email = req.params.email;
        let qry = "select * from registration where email=?";
        conn.query(qry, [email], (err, result) => {
            if (!err) {
                res.render("newuser");
            }
            else{
                console.log(err);
            }
        })
    } catch (err) {
        console.log(err);
    }
})
app.get("/newuser",async(req,res)=>{
    try{
        const { id, name, milk, price } = req.query
        let qry = "select * from customer where IDCust=?";
        conn.query(qry, [id], (err, results) => {
            if (results.length > 0) {
                res.send("ID existed");
            }
            else {
                let qry1 = "insert into customer values(?,?,?,?);"
                conn.query(qry1, [id, name, milk, price], (err, result) => {
                    if (!err) {
                        res.render("newuser", { mesg: true})
                    }
                    else {
                        console.log(err);
                    }
                })
            }
        })
    } catch(err){
        console.log(err);
    }
})
app.get("/custdelete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let qry = "delete from customer where IDCust=?";
        conn.query(qry, [id], (err, result) => {
            if (!err) {
                res.send("deleted");
            }
            else {
                console.log(err);
            }
        })
    } catch (err) {
        console.log(err);
    }

})
app.get("/addcustomer", async (req, res) => {
    try {
        const { IDCust, CustName, CustMilk, CustPrice } = req.query
        let qry = "select * from customer where IDCust=?";
        conn.query(qry, [IDCust], (err, results) => {
            if (results.length > 0) {
                res.send("ID existed");
            }
            else {
                let qry1 = "insert into customer values(?,?,?,?);"
                conn.query(qry1, [IDCust, CustName, CustMilk, CustPrice], (err, result) => {
                    if (!err) {
                        res.render("adminside", { custadd: true })
                    }
                    else {
                        console.log(err);
                    }
                })
            }
        })

    } catch (err) {
        console.log(err);
    }
})
app.get("/dailymilk", (req, res) => {
    const { idcust, milk, degree,fat,factor } = req.query;
    let qry = "select * from customer where IDCust=?";
    conn.query(qry, [idcust], (err, result) => {
        if (result.length > 0) {
            let qry1 = "select * from dailymilk where idcust=?";
            conn.query(qry1, [idcust], (err, data) => {
                if (data.length > 0) {
                    const price = (milk*factor*fat);
                    let qry1 = "update dailymilk set milk=?, price=? where idcust=?";
                    conn.query(qry1, [milk, price, idcust], (err, result) => {
                        if (!err) {
                            res.send("Updated");
                        }
                        else {
                            console.log(err);
                        }
                    })
                }
                else {
                    const price = (milk*factor*fat);
                    let qry2 = "insert into dailymilk values(?,?,?)";
                    conn.query(qry2, [idcust, milk, price], (err, results) => {
                        if (!err) {
                            res.send("Inserted");
                        }
                        else {
                            console.log(err);
                        }
                    })

                }
            })

        }
        else{
            res.send('plz add in customer table');
        }
    })

})
// app.get('/request', async(req,res)=>{
//     try{
//         let qry ="select * from registration";
//         conn.query(qry,(err,results)=>{
//             if(!err){
//                 res.render("request",{ data: results});
//             }
//             else{
//                 console.log(err);
//             }
//         })
//     }catch(err){
//         console.log(err);
//     }
// })
//customer admoni side

app.listen(4000, () => {
    console.log(`Connected 4000`);
});

