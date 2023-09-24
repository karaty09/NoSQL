// const express = require('express')
// const cors = require('cors')
// const app = express()
// const port = 3000
// app.use(cors())
// app.use(express.json());
// app.get('/', (req, res) => { 
// res.send('Hello World! Let\'s Working with NoSQL Databases')
// })

// app.get('/idf', (req, res) => {
//     res.send('Here is my Page')
// })

// app.get('/slist', async(req, res) => {
//     const client = new MongoClient(uri);
//     await client.connect();
//     const objects = await client.db('admin').collection('student').find({}).project({_id:0, Saving:0, GPA:0, Salary:0}).toArray();
//     await client.close();
//     res.status(200).send(objects);
// })

// app.post('/slist/create', async(req, res) => {
//     const object = req.body;
//     const client = new MongoClient(uri);
//     await client.connect
//     await client.db('admin').collection('student').insertOne({
//         "Student":object['Student'],
//         "Title":object['Title'],
//         "Name":object['Name'],
//         "Surname":object['Surname'],
//         "Field":object['Field'],
//         "Project":object['Project'],
//         "Savings":object['Savings'],
//         "GPA":object['GPA'],
//         "Salary":object['Salary'],
//     })
    
//     await client.close();
//     res.status(200).send({
//         "status": "ok",
//         "message": "Object is created",
//         "Student ID": object['Student']
//     })
// })

// app.put('/slist/update', async(req, res) => {
//     const object = req.body;
//     const id = object._id;
//     const client = new MongoClient(uri);
//     await client.db('admin').collection('student').updateOne({'_id':ObjectId(id)},
//     {
//         '$set':{
//             "Student":object['Student'],
//             "Title":object['Title'],
//             "Name":object['Name'],
//             "Surname":object['Surname'],
//             "Field":object['Field'],
//             "Project":object['Project'],
//             "Savings":object['Savings'],
//             "GPA":object['GPA'],
//             "Salary":object['Salary'],
//         }
//     });

//     app.delete('/slist/delete', async(req, res) => {
//         const object = req.body;
//         const id = object._id;
//         const client = new MongoClient(uri);
//         await client.db('admin').collection('student').deleteOne({"Student":Object[Student]})
//     })
    
//     await client.close();
//     res.status(200).send({
//         "status": "ok",
//         "message": "Object with"+id+" is delete.",

//     })
// })

//     app.get('slist/field/:searchText',async (req,res) =>{
//         const {params} = req;
//         const searchtext = params.searchtext
//         const client = new MongoClient(uri);
//         await client.connect();
//         const objects = await client.db('admin').collection('student').find({"$text" : {"$seach": searchtext}}).toArray();
//         await client.close();
//         res.status(200).send({
//         "status": "ok",
//         "message": "Object is created",
//         "Student ID": object['Student']
//         })
//     })

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
//     })
// ///////////////////////////////////////////////////////////////////////////////////////
// //การเชื่อมต่อกับฐานข้อมูล
// const { MongoClient, ObjectId} = require("mongodb");

// //const uri = "mongodb://localhost:27017";
// const uri = "mongodb://127.0.0.1:27017/";

// const connectDB = async() => {
// try {
// const client = new MongoClient(uri);
// await client.connect();
// console.log("MongoDB connected successfully.");
// } catch (err) {
// console.log(err);
// process.exit(1);
// }
// }
// connectDB();
const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello ITD Dev')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const {MongoClient, ObjectId} = require('mongodb');
const { query } = require('express')
// const uri = 'mongodb://localhost:27017';
const uri = "mongodb://127.0.0.1:27017/";

// const connectDB = async() => {
//     try {
//         const client = new MongoClient(uri);
//         await client.connect();
//         console.log('MongoDB is now conneted.')

//     } catch (error) {
//         console.log(error);
//         process.exit(1);
//     }
// }

// connectDB();

app.get('/slist', async(req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    const page = parseInt(req.query.page) || 1
    // const objects = await client.db('mydb').collection('s_collection').find({}).sort({"GPA": -1}).limit(10).project({_id:0, GPA:0, Savings:0, Salary:0}).toArray();
    const objects = await client.db('heart').collection('Heart Disease').find().toArray();
    await client.close();
    res.status(200).send(objects);

})



app.post('/slist/create', async(req, res) => {
    const object = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('heart').collection('Heart Disease').insertOne({
        "ID": object['ID'],
        "Age": object['Age'],
        "Sex": object['Sex'],
        "Chest_pain_type": object['Chest_pain_type'],
        "BP": object['BP'],
        "Cholesterol": object['Cholesterol'],
        "FBS_over_120": object['FBS_over_120'],
        "EKG_results": object['EKG_results'],
        "Max_HR": object['Max_HR'],
        "EXercise_angina": object['EXercise_angina'],
        "ST_depression": object['ST_depression'],
        "Slope_of_ST": object['Slope_of_ST'],
        "Number_of_vessels_fluro": object['Number_of_vessels_fluro'],
        "Thallium": object['Thallium'],
        "Heart_Disease": object['Heart_Disease'],
    });

    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Object is created",
        "object": object['ID']
    })
})

app.put('/slist/update', async(req, res) => {
    const object = req.body;
    const id = object._id;
    const client = new MongoClient(uri);
    console.log("welcome")
    await client.connect();
    await client.db('heart').collection('Heart Disease').updateOne({'_id': ObjectId(id)}, 
    {"$set": {
        "ID": object['ID'],
        "Age": object['Age'],
        "Sex": object['Sex'],
        "Chest_pain_type": object['Chest_pain_type'],
        "BP": object['BP'],
        "Cholesterol": object['Cholesterol'],
        "EKG_results": object['EKG_results'],
        "Max_HR": object['Max_HR'],
        "EXercise_angina": object['EXercise_angina'],
        "ST_depression": object['ST_depression'],
        "Slope_of_ST": object['Slope_of_ST'],
        "Number_of_vessels_fluro": object['Number_of_vessels_fluro'],
        "Thallium": object['Thallium'],
        "Heart_Disease": object['Heart_Disease'],
    }});
    await client.close();
    res.status(200).send({
        'status': "ok",
        'message': "Object with ID "+id+" is updated.",
        'object': object
    });
})

app.delete('/slist/delete', async(req, res) => {
    const object = req.body;
    const id = object._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('heart').collection('Heart Disease').deleteOne({"_id": ObjectId(id)});
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": " with ID",
        "object" : object['_id']

    });
})


app.get('/slist/field/:searchText', async(req, res) => {
        const { params } = req;
        const searchText = params.searchText
        const client = new MongoClient(uri);
        await client.connect();
        const objects = await client.db('heart').collection('Heart Disease').find({ $text: {$search: searchText } }).sort({ "Date received": -1 }).limit(5).toArray();
        await client.close();
        res.status(200).send({
          "status": "ok",
          "searchText": searchText,
          "Complaint": objects
        });
      })

app.get('/slist/:id', async (req, res) => {
        const id = req.params.id
        const client = new MongoClient(uri);
        await client.connect();
        const objects = await client.db('heart').collection('Heart Disease').findOne({ _id: ObjectId(id) });
        await client.close();
        res.status(200).send(objects);
    })