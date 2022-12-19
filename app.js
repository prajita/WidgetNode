var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var cors = require('cors');
const path = require("path");
const port = process.env.PORT || 3005;

Widget = require('./models/Widget');
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


//apis for widgets
app.get('/api/widgets', async function (req, res) {
    await Widget.getWidgets(function (err, widgets) {
        if (err) {
            throw err;
        } else {
            res.send(widgets);
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
            console.log("succesfully updated widget")
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
            console.log("succesfully updated widget")
            res.send(widget);
        }else {
            res.send(err);
        }
    })
});

app.listen(port);
console.log('running on port....', port);