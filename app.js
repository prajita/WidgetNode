var express = require('express');

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dotenv= require('dotenv');
var jwt = require('jsonwebtoken');

var cors = require('cors');
const path = require("path");
dotenv.config({path:"/Users/prajitas/widget-node/.env"})
const port = 3000;

Widget = require('./models/Widget');
User = require('./models/User');
const url = 'mongodb+srv://prajita:mamon1992@cluster0.pu3knii.mongodb.net/WidgetDb';
mongoose.set('strictQuery', true);
mongoose.connect(url, { useNewUrlParser: true });
var app = express();

app.use(bodyParser.json());
app.use(cors());


app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

init();

// Use connect method to connect to the Server
function init() {
    connectingDb = new Promise(
      function (resolve, reject) {
        mongoose.connect(url, function (err, client) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
                reject(err);
            }
            else {
                console.log('Connection established to', url);
                //Close connection
                //db.close();
            }
        })
      });
}

//login
app.post('/login', async function(req, res){
    const {email, password} = req.body;
    await User.getUserByEmail(email, function (err, user) {
        if (err) {
            res.status(400).send({error: "Oops !!!email is not valid"});
        } else {
            const userObj = user.length > 0 ? user[0] : null;
            console.log("user found: ",userObj);
            if(!userObj){
                res.status(400).send({error: "Oops !!!email is not valid"});
            }else if(userObj.password!==password){
                res.status(400).send({error: "hey !!! password did not match"});
            }else{
                const jwtToken =jwt.sign({"id": userObj.id , "email": userObj.email}, `${process.env.JWT_SECRET}`);
                res.status(200).send({message: "Welcome back !", user: userObj, token: jwtToken});
            }
        }
    });
    

})

//apis for widgets

app.get("/api/widgets", async function (req, res) {

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    await Widget.getWidgets(function (err, datalist) {
        if (err) {
            throw err;
        } else {
            if(page && limit && limit !== 0 && page !== 0){
                //send limited widgets
                const startIndex = (page-1) * limit;
                const endIndex = page * limit;
                const results = {};
                const widgets = datalist.slice(startIndex, endIndex);
                results.totalCount = datalist.length;
                results.widgets = widgets;
                res.send(results);
            }else{
                //no query param so send all widgets
                res.send({widgets: datalist, totalCount: datalist.length});
            }
        }
    })
    
});

app.get('/api/widgets/:_id', async function (req, res) {
    await Widget.getWidgetById(req.params._id, (err, widget) => {
        if (err) {
            throw err;
        } else {
            res.send(widget);
        }
    })
});

app.put('/api/widgets/:_id', async function (req, res) {
    await Widget.updateWidget(req.params._id, req.body, {new:true}, (widget, err) => {
        if(widget) {
            res.send(widget);
        }else {
            res.send(err);
        }
    })
});

app.post('/api/widgets', async function (req, res) {
    await Widget.addWidget(req.body, function (err, widget) {
        if (err) {
            throw err;
        } else {
            res.send(widget);
        }
    })
});

app.delete('/api/widgets/:_id', async function (req, res) {
    await Widget.deleteWidget(req.params._id, function (err, widget) {
        if (err) {
            throw err;
        } else {
            res.send(widget);
        }
    })
});

app.put('/api/widgets/:status/:_id', async function (req, res) {
    await Widget.updateWidgetStatus(req.params._id,req.params.status,{new:true}, (widget, err) => {
        if(widget) {
            res.send(widget);
        }else {
            res.send(err);
        }
    })
});

app.listen(port);
console.log('running on port....', port);
