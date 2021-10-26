const express = require("express");
const handlebars = require('express-handlebars').create({defaultLayour:'main'});
const app = express();
const mysql = require('./dbcon.js')
const bodyParser = require('body-parser');
const cors = require('cors')

app.engine('handlebars',handlebars.engine);
app.set('view engine', 'handlebars');
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.listen(4747,() => {})
    console.log("listening to port 4747")

//extracted from the get function below as I need to pull all data often to rebuild tables
let currentData = function(res){
    let context = {}
    mysql.pool.query("SELECT * FROM workouts", (err,rows,fields) => {
        if(err){
            next(err);
            return;
        }
        context.rows = rows
        res.send(context);
    })
}
// Base code for each operation taken from lecture notes and then modified to meet
// assignment requirements
app.get('/', (req, res, next) => {
        res.render('home')
    });

app.get('/ProductionLots', (req, res, next) => {
    let context = {};
    console.log("Production Lot GET Request Received")
    mysql.pool.query('SELECT * FROM ProductionLots', (err, rows, fields) => {
        if(err){
            next(err);
            return
        }
        context.results = rows
        res.render('ProductionLots', context)
    })
});

app.get('/CropSpecies', (req, res, next) => {
    let context = {};
    mysql.pool.query('SELECT * FROM CropSpecies', (err, rows, fields) => {
        if(err){
            next(err);
            return
        }
        context.results = rows
        res.render('CropSpecies', context)
    })
});

app.get('/GermplasmOrigins', (req, res, next) => {
    let context = {};
    mysql.pool.query('SELECT * FROM GermplasmOrigins', (err, rows, fields) => {
        if(err){
            next(err);
            return
        }
        context.results = rows
        res.render('GermplasmOrigins', context)
    })
});

app.get('/PCPrograms', (req, res, next) => {
    let context = {};
    mysql.pool.query('SELECT * FROM PCPrograms', (err, rows, fields) => {
        if(err){
            next(err);
            return
        }
        context.results = rows
        res.render('PCPrograms', context)
    })
});

app.get('/PCSites', (req, res, next) => {
    let context = {};
    mysql.pool.query('SELECT * FROM PCSites', (err, rows, fields) => {
        if(err){
            next(err);
            return
        }
        context.results = rows
        res.render('PCSites', context)
    })
});

app.get('/ProductionFields', (req, res, next) => {
    let context = {};
    mysql.pool.query('SELECT * FROM ProductionFields', (err, rows, fields) => {
        if(err){
            next(err);
            return
        }
        context.results = rows
        res.render('ProductionFields', context)
    })
});

app.get('/ProductionSpecialists', (req, res, next) => {
    let context = {};
    mysql.pool.query('SELECT * FROM ProductionSpecialists', (err, rows, fields) => {
        if(err){
            next(err);
            return
        }
        context.results = rows
        res.render('ProductionSpecialists', context)
    })
});

app.get('/RDPrograms', (req, res, next) => {
    let context = {};
    mysql.pool.query('SELECT * FROM RDPrograms', (err, rows, fields) => {
        if(err){
            next(err);
            return
        }
        context.results = rows
        res.render('RDPrograms', context)
    })
});

app.get('/SpecialistMemberships', (req, res, next) => {
    let context = {};
    mysql.pool.query('SELECT * FROM SpecialistMemberships', (err, rows, fields) => {
        if(err){
            next(err);
            return
        }
        context.results = rows
        res.render('SpecialistMemberships', context)
    })
});


app.post('/',function(req,res,next){
    let context = {};
    console.log("post request recieved")
    mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `unit`) VALUES (?,?,?,?,?)",
      [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.unit], 
      function(err, result){
      if(err){
        next(err);
        return;
      }
      console.log("Data inserted into server")
      currentData(res)
      console.log("Data sent to client")
    });
  });

app.delete('/', function(req,res,next){
    var context = {}
    mysql.pool.query('DELETE FROM workouts WHERE id=?', [req.body.id], function(err,result){
        if (err){
            next(err);
            return;
        }
        console.log("Data maybe deleted")
        currentData(res);
    })
})

app.put('/',function(req,res,next){
    mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, unit=? WHERE id=? ",
        [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.unit, req.body.id],
        function(err, result){
        if(err){
        next(err);
        return;
        }
        console.log("data maybe updated")
        currentData(res);
    });
});

app.get('/reset-table',function(req,res,next){
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
        var createString = "CREATE TABLE cs290_vanderwc.workouts(" +
        "id INT PRIMARY KEY AUTO_INCREMENT," +
        "name VARCHAR(255) NOT NULL," +
        "reps INT," +
        "weight INT, " +
        "date DATE," +
        "unit VARCHAR(255) NOT NULL)"
        mysql.pool.query(createString, function(err){
        context.results = "Table reset";
        res.render('home',context);
        })
    });
    });

app.get('/create-table',function(req,res,next){
    var context = {};
    var createString = "CREATE TABLE cs290_vanderwc.workouts (" +
        "id INT PRIMARY KEY AUTO_INCREMENT," +
        "name VARCHAR(255) NOT NULL," +
        "reps INT," +
        "weight INT, " +
        "date DATE," +
        "unit VARCHAR(255) NOT NULL)"
        console.log(createString)
    mysql.pool.query(createString, function(err){
        context.results = "Table created";
        res.render('home',context);
        })
    });

 // manually adds some data for testing purposes
app.get('/add-data',function(req,res,next){
    var context = {};
    var createString = "INSERT INTO workouts(name, reps, weight, date, unit) VALUES ('Benchpress', 10, 120,'10-02-2020','lbs')"; 
        console.log(createString)
    mysql.pool.query(createString, function(err){
        context.results = "Data Added";
        res.render('home',context);
        })
    });