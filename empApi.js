let express=require("express");
let app=express();
const cors=require('cors');
app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET","POST","OPTIONS","PUT","PATCH","DELETE","HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept"
    );
    next();
});

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'DELETE,PUT',
    // Allow DELETE method
};

app.use(cors(corsOptions));
var port=process.env.PORT||2410;
let mysql=require("mysql");
let Data={
    host:"localhost",
    user:"root",
    password:"",
    database:"newdb"
};

app.listen(port,()=>console.log(`Node app listening on port ${port}!`));
app.get("/svr/department/:department",function(req,res){
    let department=req.params.department;
    let connection=mysql.createConnection(Data);
    let sql='Select * FROM employees WHERE department=?';
    connection.query(sql,department,function(err,result){
        if(err) res.send("Error in Database",err.message);
        else{
        res.send(result);
        } 
    })
})

app.get("/svr/designation/:designation",function(req,res){
    let designation=req.params.designation;
    let connection=mysql.createConnection(Data);
    let sql="Select * FROM employees WHERE designation=?";
    connection.query(sql,designation,function(err,result){
        if(err) res.send("Error in Database",err.message);
        else{
            res.send(result);
        } 
    })
})

app.get("/svr/gender/:gender",function(req,res){
    let gender=req.params.gender;
    let connection=mysql.createConnection(Data);
    let sql="Select * FROM employees WHERE gender=?";
    connection.query(sql,gender,function(err,result){
        if(err) res.send("Error in Database",err.message);
        else{
            res.send(result);
            
        } 
    })
})

app.get("/svr/emps",function(req,res){
    let connection=mysql.createConnection(Data);
    let department=req.query.department;
    let designation=req.query.designation;
    let gender=req.query.gender;
    let sql="Select * FROM employees";
    connection.query(sql,function(err,result){
        if(err) res.send(err);
        else{
            if(department){
                result=result.filter((n)=>n.department===department);
            }
            if(designation){
                result=result.filter((n)=>n.designation===designation);
            }
            if(gender){
                result=result.filter((n)=>n.gender===gender);
            }
            res.send(result);
            
        } 
    })
})

app.get("/emp/:empCode",function(req,res){
    let empCode=+req.params.empCode;
    let connection=mysql.createConnection(Data);
    let sql="Select * FROM employees WHERE empCode=?";
    connection.query(sql,empCode,function(err,result){
        if(err) res.send(err);
        else res.send(result);
    })
})

app.put("/svr/emp/:empCode",function(req,res){
    let empCode=+req.params.empCode;
    let body=req.body;
    let {name,designation,department,salary,gender}=body;
    let connection=mysql.createConnection(Data);
    let sql=`UPDATE employees SET name=?,designation=?,department=?,salary=?,gender=? WHERE empCode=?`;
    connection.query(sql,[name,designation,department,salary,gender,empCode],function(err,result){
        if(err) res.send("Error in Database",err.message);
        else {
            res.send(result);
        }
        })})

app.delete("/svr/delete/:empCode",function(req,res){
            let empCode=+req.params.empCode;
            let connection=mysql.createConnection(Data);
            let sql='DELETE FROM employees WHERE empCode=?';
            connection.query(sql,empCode,function(err,result){
                if(err)
                 console.log("Error in Database");
                else {
            res.send("Successfully deleted.");
                }
                
                })
            })
        
    
app.post("/svr/emps",function(req,res){
    let body=req.body;
    let {name,department,designation,salary,empCode,gender}=body;
    let connection=mysql.createConnection(Data);
    let sql="INSERT INTO employees(empCode,name,department,designation,salary,gender) VALUES(?,?,?,?,?,?)";
    connection.query(sql,[empCode,name,department,designation,salary,gender],function(err,result){
        if(err) res.send("Error in Database",err.message);
        else {
            res.status(200).send(body);
        }
        })
})

