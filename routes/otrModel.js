const {OtrModal, validate} = require('../models/otrModels');
const {Dealer} = require('../models/dealers');
const {Otr_Purchase} = require('../models/otr_purchase');
const express  = require('express');
const app = express();
const router   = express.Router();
const shortid  = require('shortid');

const multer = require('multer');
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const path = require( 'path' );

const bodyParser=require('body-parser');
app.use(bodyParser.json());

const s3 = new aws.S3({
    accessKeyId: 'AKIAZ6FEPOPCLJN2IKEG',
    secretAccessKey: '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',
    Bucket: 'bikex-image-bucket'
   });
  
   const store = multerS3({
    s3: s3,
    bucket: 'bikex-image-bucket',
    acl: 'public-read',
    key: function (req, file, cb) {
     cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
    }
   })

   const upload = multer({
    storage: store,
   }).single('Image')


// add models
router.post('/' , async(req , res) => {
    try{
        const { error } = validate(req.body); 
        if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});

        let otrModel = new OtrModal({
            make            : req.body.make,
            model           : req.body.model,
            type            : req.body.type,
            fuel_type       : req.body.fuel_type,
            displacement    : req.body.displacement,
            mileage         : req.body.mileage,
            weight          : req.body.weight,
            tank_capacity   : req.body.tank_capacity,
            odometer        : req.body.odometer,
            tyre_type       : req.body.tyre_type,
            brakes          : req.body.brakes,
            breaking_system : req.body.breaking_system,
            start_type      : req.body.start_type,
            comment         : req.body.comment,
            about_vehicle   : req.body.about_vehicle,
            manufacturer_url : req.body.manufacturer_url,
            tags             : req.body.tags
        })

        await otrModel.save().then((data) => {
            return res.status(200).send(data); 
        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Error into model Addition"}); 
        })
    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

// add hero images
router.put('/add-image/:id' , async(req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"}); 
        }
        upload(req,res,async function(err){
            if(err){
                return res.json( { error: err } );
            }else{
                let image_name = req.file.location
                console.log("success")

                await OtrModal.updateOne({_id : id} , {$set : {hero_image : image_name}}).then((data) => {
                    return res.send({"err": 0 , "msg" : "Image successfully added"}); 
                }).catch((err) => {
                    return res.send({"err": 1 , "msg" : "Image Upload Error"}); 
                })
            }
        })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

// add subsets
router.put('/add-superset/:id' , async(req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.status(400).send({"err": 1 , "msg" : "Not a valid id"}); 
        }
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        upload(req,res,async function(err){
            if(err){
                console.log("Errorrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
                return res.json( { error: err } );
            }else{
                let image_name = req.file.location

                let obj = {
                    // id     : shortid.generate(),
                    color  : req.body.color,
                    price  : Number(req.body.price),
                    dealer : req.body.dealer,
                    image  : image_name,
                    status : req.body.status == undefined || req.body.status === "" ? 1 : req.body.status,
                    variant: req.body.variant,
                    hex_color: req.body.hex_color,
                    description: req.body.description,
                    additional_cost: req.body.additional_cost,
                    add_ons : req.body.add_ons
                }

                console.log("obje" , obj)
                // return
        
                await OtrModal.updateOne({_id : id} , {$push : {"superset" : obj}}).then((superset_data) => {
                    return res.send({"err": 0 , "msg" : "Superset added successfully"}); 
                }).catch((err) => {
                    return res.send({"err": 1 , "msg" : "Error in superset addtion"}); 
                })
            }
        })


    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.put('/update-superset-image/:id' , async(req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"}); 
        }
        let supersetId = req.body.id
        if(!supersetId){
            return res.send({"err": 1 , "msg" : "Not a valid supersetId"}); 
        }
        upload(req,res,async function(err){
            if(err){
                return res.json( { error: err } );
            }else{
                let image_name = req.file.location
                let query = {
                    _id : id,
                    superset : {$elemMatch : {id : {$eq : supersetId}}}
                }
                await OtrModal.updateOne(query ,{$set : {"superset.$.image": image_name}})
                    .then((data) => {
                        return res.send({"err": 0 , "msg" : "Superset Image updated successfully"});
                    }).catch((err) => {
                        return res.send({"err": 1 , "msg" : "Superset Image updation error"}); 
                    })
            }
        })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.put('/update-superset-data/:id' , async(req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"}); 
        }
        let supersetId = req.body.id
        let query = {
            _id : id,
            superset : {$elemMatch : {id : {$eq : supersetId}}}
        }

        await OtrModal.updateOne(query , {$set : { "superset.$.color": req.body.color ,"superset.$.description": req.body.description , "superset.$.price": Number(req.body.price) , "superset.$.dealer" : req.body.dealer , "superset.$.status" : req.body.status == undefined || req.body.status === "" ? 1 : req.body.status , "superset.$.variant" : req.body.variant , "superset.$.hex_color" : req.body.hex_color , "superset.$.additional_cost" : req.body.additional_cost , "superset.$.add_ons" : req.body.add_ons}})
            .then((data) => {
                return res.send({"err": 0 , "msg" : "Superset data updated Successfully"}); 
            }).catch((err) => {
                return res.send({"err": 1 , "msg" : "Superset data not updated"}); 
            })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.put('/delete-superset-data/:id' , async(req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"}); 
        }
        let supersetId = req.body.id
        if(!supersetId){
            return res.send({"err": 1 , "msg" : "Not a valid supersetId"}); 
        }

        let query = {
            _id : id,
            superset : {$elemMatch : {id : {$eq : supersetId}}}
        }

        await OtrModal.update(query , {$pull:{"superset":{"id" : supersetId}}} , {new: true , multi: false})
            .then((data) => {
                return res.send({"err": 0 , "msg" : "Superset data deleted successfully"});

            }).catch((err) => {
                return res.send({"err": 1 , "msg" : "Superset data not deleted"});
            })
    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

// fetch all models for dashboard
router.get('/otr-list' , async(req , res) => {
    try{
        let limit  = parseInt(req.query.limit)
        let skip = (parseInt(req.query.page)-1)*parseInt(limit)
        await OtrModal.find({} , {make : 1 , model: 1 , hero_image: 1 , superset : 1}).limit(limit).skip(skip)
        .then(async(data) => {
            return res.send(data)
            
        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Error in fetch models details"}); 
        })
    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

// fetch all models
router.get('/' , async(req , res) => {
    try{
        await OtrModal.find()
        .populate({
            path : 'superset.dealer'
        })
        .then(async(data) => {
            // console.log("data")
            // // return res.send(data)
            // if(data.length > 0){
            //     let arr_obj = JSON.parse(JSON.stringify(data))
            //     for(let i = 0 ; i < data.length ; i++){
                    
            //         if(data[i].superset.length > 0){
            //             let arr = []
            //             for(let j = 0 ; j < data[i].superset.length ; j++){
            //                 let dealer_data = await Dealer.findOne({_id : data[i].superset[j].dealer})
            //                 let dealer_obj = {}
            //                 if(dealer_data){
            //                     dealer_obj.id            = data[i].superset[j].id
            //                     dealer_obj.dealer        = data[i].superset[j].dealer
            //                     dealer_obj.variant        = data[i].superset[j].variant
            //                     dealer_obj.dealer_status = dealer_data.status
            //                     dealer_obj.name    = dealer_data.name
            //                     dealer_obj.email   = dealer_data.email
            //                     dealer_obj.phone   = dealer_data.phone
            //                     dealer_obj.pincode = dealer_data.pincode
            //                     dealer_obj.city    = dealer_data.city
            //                     dealer_obj.state   = dealer_data.state
            //                     dealer_obj.address = dealer_data.address
            //                     dealer_obj.comment = dealer_data.comment
            //                     dealer_obj.image   = data[i].superset[j].image
            //                     dealer_obj.color   = data[i].superset[j].color
            //                     dealer_obj.price   = data[i].superset[j].price
            //                     dealer_obj.superset_status = data[i].superset[j].status
        
            //                     arr.push(dealer_obj)
            //                 }
            //             }
            //             arr_obj[i].superset = arr
            //         }
                    
            //     }
            // console.log("data>>")

                return res.send(data)

            // }else{
            //     return res.send(data)
            // }
            
        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Error in fetch models details"}); 
        })
    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

// list of model through variant id
router.get('/getmodelsbyVariant/:id' , async (req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"}); 
        }
        await OtrModal.find({variant : id}).then((data) => {
            return res.send(data); 
        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Error in fetch models through variant"}); 
        })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

// individual model fetch
router.get('/:id' , async (req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"}); 
        }
        await OtrModal.findOne({_id : id})
        .then(async(data) => {
            let arr = []
            console.log(data)
            if(data){
                let obj = JSON.parse(JSON.stringify(data))
                for(let i = 0 ; i < data.superset.length ; i++){
                    let dealer_data = await Dealer.findOne({_id : data.superset[i].dealer})
                    let dealer_obj = {}
                    // console.log("before" , dealer_obj)
                    if(dealer_data){
                        dealer_obj.id  = data.superset[i].id
                        dealer_obj.dealer  = data.superset[i].dealer
                        dealer_obj.variant  = data.superset[i].variant
                        dealer_obj.dealer_status = dealer_data.status
                        dealer_obj.name    = dealer_data.name
                        dealer_obj.email   = dealer_data.email
                        dealer_obj.phone   = dealer_data.phone
                        dealer_obj.pincode = dealer_data.pincode
                        dealer_obj.city    = dealer_data.city
                        dealer_obj.state   = dealer_data.state
                        dealer_obj.address = dealer_data.address
                        dealer_obj.comment = dealer_data.comment
                        dealer_obj.image   = data.superset[i].image
                        dealer_obj.color   = data.superset[i].color
                        dealer_obj.price   = data.superset[i].price
                        dealer_obj.superset_status = data.superset[i].status

                        arr.push(dealer_obj)
                    }
                // console.log("After" , dealer_obj)

                }

                obj.superset = arr
                // console.log(obj)
                return res.send(obj)

            }else{
                return res.send({"err": 1 , "msg" : "Model not found"});  
            }

        }).catch((err) => {
            console.log(err)
            return res.send({"err": 1 , "msg" : "Individual model fetch error"}); 
        })
    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

// update model
router.put('/:id' , async(req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.status(400).send({"err": 1 , "msg" : "Not a valid id"});
        }

        const { error } = validate(req.body); 
        if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});

        let otr_obj = {
            make             : req.body.make,
            model            : req.body.model,
            type             : req.body.type,
            fuel_type        : req.body.fuel_type,
            displacement     : req.body.displacement,
            mileage          : req.body.mileage,
            weight           : req.body.weight,
            tank_capacity    : req.body.tank_capacity,
            odometer         : req.body.odometer,
            tyre_type        : req.body.tyre_type,
            brakes           : req.body.brakes,
            breaking_system  : req.body.breaking_system,
            start_type       : req.body.start_type,
            comment          : req.body.comment,
            about_vehicle    : req.body.about_vehicle,
            manufacturer_url : req.body.manufacturer_url,
            tags             : req.body.tags
        }

        await OtrModal.updateOne({_id : id} , {$set : otr_obj}).then((data) => {
            return res.send({"err": 0 , "msg" : "Model Updated Successfully"});
        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Model not updated"});
        })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

// delete particular model
router.delete('/:id' , async (req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"});
        }
        await OtrModal.deleteOne({_id : id}).then((data) => {
            return res.send({"err": 0 , "msg" : "Deleted successfully"}); 
        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Error in model deletion"}); 
        })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

// check specific model name
router.post('/check-model-name' , async (req , res) => {
    try{
        let model_name = req.body.model

        await OtrModal.findOne({model : model_name} , {model : 1}).then((check_model) => {
            if(check_model){
                return res.send({"err": 1 , "msg" : "Model Already Exist"});
            }else{
                return res.status(200).send({"err": 0 , "msg" : "Model doesn't exist"});
            }

        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "model name check error"});
        })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})


// fetch model by make
router.post('/make' , async (req , res) => {
    try{
        let make = req.body.make
        if(!make){
            return res.send({"err": 1 , "msg" : "Not a valid make"}); 
        }
        await OtrModal.find({make : make} , {hero_image : 1 , make : 1 , model : 1 , superset : 1}).then((data) => {
            return res.send(data); 
        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Error in fetch models through Make"}); 
        })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

// fetch model by type
router.post('/type' , async (req , res) => {
    try{
        let type = req.body.type
        if(!type){
            return res.send({"err": 1 , "msg" : "Not a valid type"}); 
        }
        await OtrModal.find({type : type} , {hero_image : 1 , make : 1 , model : 1 , superset : 1 , type : 1}).then((data) => {
            return res.send(data); 
        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Error in fetch models through type"}); 
        })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

// fetch model by price
router.post('/budget' , async (req , res) => {
    try{
        let price = req.body.price
        if(!price){
            return res.send({"err": 1 , "msg" : "Not a valid price"}); 
        }

        await OtrModal.aggregate([
            {
               $project: {
                make : "$make",
                model : "$model",
                type : "$type",
                hero_image : "$hero_image",
                superset: {
                     $filter: {
                        input: "$superset",
                        as: "superset",
                        cond: { $lt: [ "$$superset.price", price ] }
                     }
                  }
               }
            }
         ])
        .then(async(data) => {
             let arr = []
                await data.map((el) => {
                    if(el.superset.length > 0){
                        arr.push(el)
                    }
                })
            return res.send(arr); 
        }).catch((err) => {
            console.log(err)
            return res.send({"err": 1 , "msg" : "Error in fetch models through type"}); 
        })

    }catch(e){
        console.log(e)
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

// fetch model by displacement
router.post('/displacement' , async (req , res) => {
    try{
        let displacement = req.body.displacement
        if(!displacement){
            return res.send({"err": 1 , "msg" : "Not a valid displacement"}); 
        }
        await OtrModal.find({displacement : displacement})
         .then(async(data) => {
            return res.send(data); 
        }).catch((err) => {
            console.log(err)
            return res.send({"err": 1 , "msg" : "Error in fetch models through type"}); 
        })

    }catch(e){
        console.log(e)
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.get('/model-data-with-dealer/:id' , async(req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "not a valid id"});
        }
        await OtrModal.findOne({_id : id})
            .populate({
                path : 'superset.dealer'
            })
            .then((data) => {
                if(data){
                    return res.send(data)
                }else{
                    return res.send({"err": 1 , "msg" : "Model not found"});
                }
            }).catch((err) => {
                return res.send({"err": 1 , "msg" : "Model data fetch error"});
            })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"});
    }
})

router.get('/model-data-without-dealer/:id' , async(req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "not a valid id"});
        }
        await OtrModal.findOne({_id : id} , {dealer : 0})
            .then((data) => {
                if(data){
                    return res.send(data)
                }else{
                    return res.send({"err": 1 , "msg" : "Model not found"});
                }

            }).catch((err) => {
                return res.send({"err": 1 , "msg" : "Model data fetch error"});
            })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"});
    }
})

router.post('/filter-model' , async(req , res) => {
    try{
        let model_name = req.body.contains
        if(!model_name || model_name === ""){
            return res.send({"err": 1 , "msg" : "Contains not found"});
        }

        let split_data = model_name.split(/(?<=^\S+)\s/)
        let obj = {
            make  : split_data[0],
            model : split_data[1]
        }

        await OtrModal.find({$or : [{make : obj.make},{model : obj.model}]})
            .then((data) => {
                return res.send(data)
            }).catch((err) => {
                return res.send({"err": 1 , "msg" : "Model data not fetched"});
            })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"});
    }
})

router.put('/brand-logo/:id' , async(req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"}); 
        }

        upload(req,res,async function(err){
            if(err){
                return res.json( { error: err } );
            }else{
                let image_name = req.file.location
                console.log("success")

                await OtrModal.updateOne({_id : id} , {$set : {brand_logo : image_name}}).then((data) => {
                    return res.send({"err": 0 , "msg" : "Image successfully added"}); 
                }).catch((err) => {
                    return res.send({"err": 1 , "msg" : "Image Upload Error"}); 
                })
            }
        })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"});
    }
})

router.get('/makes/data' , async(req , res) => {
    try{
        await OtrModal.aggregate([
            {
                $group : {
                    _id : {make : "$make",
                    brand_logo : "$brand_logo"}
                }
            }
        ]).then(async(data) => {
            let obj = {}
            let arr = []
            await data.map((el) => {
                let val = Object.values(el)[0].make
                if(val in obj){}else{
                    obj[val] = ""
                    arr.push(Object.values(el)[0])
                }
            })
            return res.send(arr)
        }).catch((err) => {
           return res.send({"err": 1 , "msg" : "data fetch error"}); 
        })

    }catch(e){
        console.log(e)
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"});   
    }
})

router.post('/regex/search' , async(req , res) => {
    try{
        let tag = req.body.tag
        if(!tag){
            return res.send({"err": 1 , "msg" : "Not a valid tag"});
        }
        let q = `^${tag}`

        await OtrModal.find({$or : [{make : new RegExp(q , "i")},{model :  new RegExp(q , "i")}]})
            .then((data) => {
                return res.send(data)

            }).catch((err) => {
                return res.send({"err": 1 , "msg" : "Data filter Error"});
            })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"});
    }
})

router.post('/filter/make/budget' , async(req , res) => {
    try{
        // {$or : [{make : obj.make},{model : obj.model}]}
        let data = req.body
        let obj = {}
        let arr = []

        console.log(data)
        if(data.make != undefined){
            arr.push({make : data.make})
            obj["$or"] = arr
        }
        console.log(data.budget)

        if(data.budget != undefined){
            arr.push({superset : {$elemMatch : {price : {$lt : data.budget}}}})
            obj["$or"] = arr
        }
        console.log(obj)
        

        // await OtrModal.aggregate([
        //     {$match : obj},
        //     {
        //         $project: {
        //          make : "$make",
        //          model : "$model",
        //          type : "$type",
        //          hero_image : "$hero_image",
        //          superset: {
        //               $filter: {
        //                  input: "$superset",
        //                  as: "superset",
        //                  cond: { $eq: [ "$$superset.price",  "40000"] }
        //               }
        //            }
        //         }
        //      }
        // ])
        await OtrModal.find(obj)
        .then(async(data) => {
            // console.log(data)
            if(data.length > 0){
                return res.send(data)
            }else{
                let final_d = await OtrModal.find()
                return res.send(final_d)
            }
        }).catch((err) => {
            console.log(err)
        })

    }catch(e){
        console.log(e)
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.put('/status-update/:id' , async(req , res) => {
    try{
        let id = req.params.id
        if(!id){
            return res.send({"err": 1 , "msg" : "Not a valid id"}); 
        }
        let status = req.body.status == undefined ? 0 : req.body.status
        console.log(status)

        await OtrModal.updateOne({_id : id} , {$set : {status : status}})
            .then((data) => {
                return res.status(200).send({"err": 0 , "msg" : "Status successfully updated"}); 

            }).catch((err) => {
                return res.send({"err": 1 , "msg" : "Status not updated"}); 
            })


    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.get('/get-brand/data' , async(req , res) => {
    try{
        let final_arr = []
        let obj = {}
        let arr = ["Hero" , "Honda" , "Suzuki" , "Royal Enfield" , "TVS" ,"Bajaj" , "KTM" ,"JAWA" ,  "YAMAHA"]

        await OtrModal.find({} , {brand_logo : 1 , make : 1})
            .then(async(data) => {
                console.log(data)
                await arr.map((el) => {
                    let a = data.find(elment => elment.make.toLowerCase() == el.toLowerCase())
                    if(a == undefined){
                        obj[el] = "1"
                        let brand_image = ""
                        if(el == "Royal Enfield"){
                            brand_image = "https://imgd.aeplcdn.com/110x61/bw/makes/royal-enfield20200508193112.jpg"
                        }else if(el == "Hero"){
                            brand_image = "https://imgd.aeplcdn.com/110x61/bw/makes/hero20200508192826.jpg"
                        }else if(el == "Honda"){
                            brand_image = "https://imgd.aeplcdn.com/110x61/bw/makes/honda20200511152343.jpg"
                        }else if(el == "Suzuki"){
                            brand_image = "https://imgd.aeplcdn.com/110x61/bw/makes/suzuki20200508193118.jpg"
                        }else if(el == "TVS"){
                            brand_image = "https://imgd.aeplcdn.com/110x61/bw/makes/tvs20200508193203.jpg"
                        }else if(el == "Bajaj"){
                            brand_image = "https://imgd.aeplcdn.com/110x61/bw/makes/bajaj20200508192534.jpg"
                        }else if(el == "KTM"){
                            brand_image = "https://imgd.aeplcdn.com/110x61/bw/makes/ktm20200518163508.jpg"
                        }else if(el == "JAWA"){
                            brand_image = "https://imgd.aeplcdn.com/110x61/bw/makes/jawa20200508192940.jpg"
                        }else{
                            brand_image = "https://imgd.aeplcdn.com/110x61/bw/makes/yamaha20200508193220.jpg"
                        }


                        final_arr.push({
                            make : el,
                            existing : false,
                            brand_logo : brand_image
                        })
                    }else{
                        if(el in obj){

                        }else{
                            let img_ = ""
                            if(el == "Royal Enfield"){
                                img_ = "https://imgd.aeplcdn.com/110x61/bw/makes/royal-enfield20200508193112.jpg"
                            }else if(el == "Hero"){
                                img_ = "https://imgd.aeplcdn.com/110x61/bw/makes/hero20200508192826.jpg"
                            }else if(el == "Honda"){
                                img_ = "https://imgd.aeplcdn.com/110x61/bw/makes/honda20200511152343.jpg"
                            }else if(el == "Suzuki"){
                                img_ = "https://imgd.aeplcdn.com/110x61/bw/makes/suzuki20200508193118.jpg"
                            }else if(el == "TVS"){
                                img_ = "https://imgd.aeplcdn.com/110x61/bw/makes/tvs20200508193203.jpg"
                            }else if(el == "Bajaj"){
                                img_ = "https://imgd.aeplcdn.com/110x61/bw/makes/bajaj20200508192534.jpg"
                            }else if(el == "KTM"){
                                img_ = "https://imgd.aeplcdn.com/110x61/bw/makes/ktm20200518163508.jpg"
                            }else if(el == "JAWA"){
                                img_ = "https://imgd.aeplcdn.com/110x61/bw/makes/jawa20200508192940.jpg"
                            }else{
                                img_ = "https://imgd.aeplcdn.com/110x61/bw/makes/yamaha20200508193220.jpg"
                            }
                            
                            obj[el] = "1"
                            final_arr.push({
                                make : a.make,
                                existing : true,
                                brand_logo : img_
                            })
                        }
                    }
                })
               return res.send(final_arr)

            }).catch((err) => {
                console.log(err)
                return res.status(500).send({"err": 1 , "msg" : "Error in brand data fetch"}); 
            })

    }catch(e){
        console.log(e)
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.get('/get/data-model-with-dealer' , async(req , res) => {
    try{
        let limit  = parseInt(req.query.limit)
        let skip = (parseInt(req.query.page)-1)*parseInt(limit)
        await OtrModal.find().limit(limit).skip(skip)
        .populate({
            path : 'superset.dealer'
        }).then((data) => {
            return res.send(data)

        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Error in data fetch"}); 
        })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.put('/update/superset-add-on/data' , async(req , res) => {
    try{
        let json = req.body
        let obj = {
            model_id    : json.model_id,
            superset_id : json.superset_id,
            add_on_id   : json.add_on_id,
            name        : json.name,
            description : json.description,
            price       : json.price,
            status      : json.status
        }

        let query = {
            _id : obj.model_id,
            superset : {$elemMatch : {id : {$eq : obj.superset_id}}},
            "superset.add_ons" : {$elemMatch : {id : {$eq : obj.add_on_id}}},
        }

        await OtrModal.updateOne(query , {$set : { "superset.$.add_ons.$.name": obj.name ,"superset.$.add_ons.$.description": obj.description , "superset.$.add_ons.$.price": obj.price , "superset.$.add_ons.$.status" : obj.status}})
            .then((data) => {
                return res.send({"err": 0 , "msg" : "Updated Successfully"}); 
            }).catch((err)=> {
                return res.send({"err": 1 , "msg" : "Updation Error"}); 
            })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.get('/model/count/data' , async(req , res) => {
    try{
       let model_count    = await OtrModal.count()
       let dealer_count   = await Dealer.count()
       let success_purhcase = await Otr_Purchase.count({payment_status : 1})
       let failed_purchase = await Otr_Purchase.count({payment_status : 0})
       return res.send({
           model_count : model_count ,
           dealer_count : dealer_count,
           success_purhcase : success_purhcase,
           failed_purchase : failed_purchase,
           total_purchase : success_purhcase + failed_purchase
       })
    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.post('/filter-between-price-range' , async(req , res) => {
    try{
        let low = req.body.low
        let high = req.body.high
        OtrModal.find(
            {
                $and: 
                [
                    {"superset.price": 
                    {"$gte": low , "$lt": high}}
                ]
            
            }).then((data) => {
                return res.send(data)

            }).catch((err) =>{ 
                console.log(err)
                return res.send({"err": 1 , "msg" : "Error in filter"});
            })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"});
    }
})

router.post('/model' , async(req , res) => {
    try{
        let page = req.body.page
        if(!page){
            return res.send({"err": 1 , "msg" : "Not valid input"}); 
        }
        let limit = 10 * Number(page)
        await OtrModal.aggregate([
            { $limit : limit }
         ])
        .then((data) => {
            return res.send(data)
        }).catch((err) => {
            return res.send({"err": 1 , "msg" : "Error in model data fetch"});    
        })
    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})

router.get('/get/RandomModel' , async(req , res)=> {
    try{
        await OtrModal.aggregate([
            {$sample:{size:10}},
            {
                $project : {
                    _id : "$_id",
                    make : "$make",
                    model: "$model",
                    hero_image : "$hero_image",
                    price: { $min: "$superset.price" }
                }
            }
        ])
            .then((data) => {
                return res.send(data)

            }).catch((err) => {
                return res.send({"err": 1 , "msg" : "Error in random model fetch"}); 
            })

    }catch(e){
        return res.status(500).send({"err": 1 , "msg" : "Internal Server Error"}); 
    }
})




module.exports = router;