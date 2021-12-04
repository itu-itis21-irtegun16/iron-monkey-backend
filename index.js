const express =  require('express');
const cors =  require('cors');
const mongoose = require('mongoose');
const Deneme = require('./models/deneme')
const NewSaying = require('./models/newSaying')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { db } = require('./models/deneme');
var util= require('util');
const utf8Encoder = new util.TextEncoder();
const utf8Decoder = new util.TextEncoder("utf-8", { ignoreBOM: true });

const PORT= 8080;
const server = express();

server.use(cors());
server.use(express.json())
server.use(bodyParser.json())

const dbUrl= "mongodb+srv://Kaan:12300321mk@mongodb.zpfds.mongodb.net/deneme?retryWrites=true&w=majority";

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true,})
    .then((result) => console.log("bağlantı oky"))
    .catch((err) => console.log("olmadı",err))



server.get('/', (req,res) =>{
    res.send('selam87')
})

server.get('/wise-saying', (req,res) =>{
    NewSaying.find({}, function(err, messagePacket) {
        var messageBox = [];
    
        messagePacket.forEach(function(message) {
            messageBox.push(message)
        });

        res.send(messageBox)
      });
})

server.post('/register', (req,res,next)=>{
    const newUser = new Deneme({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        birthday: req.body.birthday,
        wight: req.body.weight,
        tall: req.body.tall,
        // workoutPrograms : []
    });
    try {
        newUser.save(err => {
            if(err){
                return res.status(400).json({
                    title: 'Email alreday exits',
                })
            }
            return res.status(200).json({
                title: 'registration completed successfully',
            })
        })
    } catch (error) {
        console.log(error)
    }
})

function addLike(req,res){
    var updateValue = req.body.message.like;
    updateValue.push({
        'id' : req.body.user_id
    })
    
    NewSaying.findByIdAndUpdate(req.body.message._id, { like : updateValue}, (err,message) =>{
        if(err){
            return res.status(500).json({
                title : 'something wrong'
            })
        }else {
            return res.status(200).json({
                title: 'like has ben sent succesfully'
            })
        }
    })
}

var addDislike = function(req,res){
    var updateValue = req.body.message.dislike;
    updateValue.push({
        'id' : req.body.user_id
    })
    
    NewSaying.findByIdAndUpdate(req.body.message._id, { dislike : updateValue}, (err,message) =>{
        if(err){
            return res.status(500).json({
                title : 'something wrong'
            })
        }else {
            return res.status(200).json({
                title: 'dislike has ben sent succesfully'
            })
        }
    })
}

function removeLike(req,res){
    var updateValue = req.body.message.like;
    updateValue.forEach((element,index) =>{
        if(element.id == req.body.user_id){
            updateValue.splice(index,1);
        }
    })

    NewSaying.findByIdAndUpdate(req.body.message._id, { like : updateValue}, (err,message) =>{
        if(err){
            return res.status(500).json({
                title : 'something wrong'
            })
        }else {
            return res.status(200).json({
                title: 'like has ben sent succesfully'
            })
        }
    })
}

function removeDislike(req,res){
    var updateValue = req.body.message.dislike;
    updateValue.forEach((element,index) =>{
        if(element.id == req.body.user_id){
            updateValue.splice(index,1);
        }
    })

    NewSaying.findByIdAndUpdate(req.body.message._id, { dislike : updateValue}, (err,message) =>{
        if(err){
            return res.status(500).json({
                title : 'something wrong'
            })
        }else {
            return res.status(200).json({
                title: 'like has ben sent succesfully'
            })
        }
    })
}

server.post('/wise-saying', (req,res,next) => {
    if(req.body.type){
        if(req.body.type == 'like'){
            if(req.body.isLiked){
                removeLike(req,res);
            }else{
                if(req.body.isDisliked){
                    var updateValueLike = req.body.message.like;
                    updateValueLike.push({
                        'id' : req.body.user_id
                    })

                    var updateValueDislike = req.body.message.dislike;
                    updateValueDislike.forEach((element,index) =>{
                        if(element.id == req.body.user_id){
                            updateValueDislike.splice(index,1);
                        }
                    }) 
                    NewSaying.findByIdAndUpdate(req.body.message._id,{like : updateValueLike, dislike : updateValueDislike}, (err,message) =>{
                        if(err){
                            return res.status(500).json({
                                title : 'something wrong'
                            })
                        }else {
                            return res.status(200).json({
                                title: 'like has ben sent succesfully'
                            })
                        }
                    })
                    
                }else{
                    addLike(req,res);
                }
            }
        }else{
            if(req.body.isDisliked){
                removeDislike(req,res);
            }else{
                if(req.body.isLiked){
                    var updateValueDislike = req.body.message.dislike;
                    updateValueDislike.push({
                        'id' : req.body.user_id
                    })
                    var updateValueLike = req.body.message.like;
                    updateValueLike.forEach((element,index) =>{
                        if(element.id == req.body.user_id){
                            updateValueLike.splice(index,1);
                        }
                    })

                    NewSaying.findByIdAndUpdate(req.body.message._id, { dislike : updateValueDislike, like: updateValueLike}, (err,message) =>{
                        if(err){
                            return res.status(500).json({
                                title : 'something wrong'
                            })
                        }else {
                            return res.status(200).json({
                                title: 'like has ben sent succesfully'
                            })
                        }
                    })
                }else{
                    addDislike(req,res);
                }
            }
        }

    }else{
        Deneme.findById({ _id : req.body.user}, (err,user) =>{
            if(err){
                return res.status(500).json({
                    title: 'server error',
                    error: err
                })
            }else {
                if(!user){
                    return res.status(401).json({
                        title: 'user not found',
                        error: 'invalid credientials'
                    })
                }else {
                    const newMessage = new NewSaying({
                        firstname : user.firstname,
                        lastname : user.lastname,
                        like : [{
                            'id' : 1
                        }],
                        dislike : [{
                            'id' : 1
                        }],
                        message : req.body.message,
                        color : req.body.color
                    });
    
                    newMessage.save(err =>{
                        if(err){
                            return res.status(400).json({
                                error: 'something wrong',
                                title: error
                            })
                        }
                        return res.status(200).json({
                            title: 'Message has ben sent successfuly',
                            newMes: newMessage
                        })
                    })
                }
            }
        })
    }
    

})

server.post('/sign-in', (req,res,next) => {
    Deneme.findOne({ email: req.body.email}, (err,user) => {
        if(err) return res.status(500).json({
            title: 'server error',
            error: err
        })
        if(!user){
            return res.status(401).json({
                title: 'user not found',
                error: 'invalid credentials'
            })
        }
        if(req.body.password == user.password){
            let token = jwt.sign({ userId: user._id}, 'secretkey');
            return res.status(200).json({
                title: 'login success',
                token: token,
                user: user
            })
        }
        else{
            return res.status(401).json({
                title: 'wrong password',
                error: 'invalid credentials'
            })
        }
    })
})

server.post('/updateUser', (req,res,next) =>{
    Deneme.findByIdAndUpdate(req.body.user_id,{gender : req.body.gender, tall : req.body.tall, wight : req.body.weight}, (err,user) =>{
        if(err){
            return res.status(500).json({
                title : 'something wrong'
            })
        }else {
            return res.status(200).json({
                title: 'user has ben updated succesfully'
            })
        }
    })
})

server.post('/saveWorkout' ,(req, res, next) =>{
    Deneme.findOne({ _id: req.body.user_id}, (err,user) => {
        if(user){
            var updateValue = user.workoutPrograms;
            updateValue.push({
                'workoutList' : req.body.workoutList,
                'workoutName' : req.body.workoutName,
                'workoutTime' : req.body.workoutTime
            })
            Deneme.findByIdAndUpdate(user._id, {workoutPrograms : updateValue}, (err,message) =>{
                if(err){
                    console.log(err)
                    return res.status(500).json({
                        title : 'something wrong'
                    })
                }else {
                    return res.status(200).json({
                        title: 'workout has been added to list'
                    })
                }
            })
        }else{
            return res.status(401).json({
                title: 'user not found',
                error: 'invalid credentials'
            })
        }
    })
})

server.post('/saveEvent' ,(req, res, next) =>{
    Deneme.findOne({ _id: req.body.user_id}, (err,user) => {
        if(user){
            var updateValue = user.events;
            updateValue.push(req.body.eventDetails)
            Deneme.findByIdAndUpdate(user._id, {events : updateValue}, (err,message) =>{
                if(err){
                    console.log(err)
                    return res.status(500).json({
                        title : 'something wrong'
                    })
                }else {
                    return res.status(200).json({
                        title: 'Event has been added to calendar'
                    })
                }
            })
        }else{
            return res.status(401).json({
                title: 'user not found',
                error: 'invalid credentials'
            })
        }
    })
})



server.listen(8080,()=>{
    console.log(`1 server started on port ${PORT}`)
})