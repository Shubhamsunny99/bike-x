const {VehicleUploads,validate} = require('../models/bikeupload')
const express = require('express');
const router = express.Router();
const multer=require('multer');
const app = express();
const bodyParser=require('body-parser');
app.use(bodyParser.json());


const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const path = require( 'path' );


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
 }).array('Image', 20);

router.post('/',(req, res) => {


  upload(req,res,function(err)
    {
      var arr = []
      for (var i in req.files){
       arr.push(req.files[i].location)
      }
 console.log(req)
      if(err)
      {res.json({'err':1,'msg':'Unexpected error!', err})}
      else
        {
        const { error } = validate(req.body); 
        if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
            
        let vehicleUploads = new VehicleUploads({
              vehicle_id: req.body.vehicle_id,
              images:arr,
              });

        vehicleUploads = vehicleUploads.save(); //saving the banner
         if(err){}
            else
            {
               res.json({'err':0,'msg':'Tada! Vehicle Image Saved'})
            }; 
        };
    });
});

router.get('/', async (req, res) => {
    const vehicleuploads = await VehicleUploads.find();
    res.send({"err":0,"data":vehicleuploads});
  });
  router.get('/get/images', async (req, res) => {
    const vehicleuploads = await VehicleUploads.find();
    res.send(vehicleuploads);
  });

  router.get('/:id', async (req, res) => {
    const vehicleuploads = await VehicleUploads.find({'vehicle_id': req.params.id});
    if(vehicleuploads){
      res.send({"err":0,"data":vehicleuploads});
    }else{
      res.send({"err":1,"data":'No datas Found'});
    }
  });
  
  router.delete('/:id', async (req, res) => {
    const vehicleuploads = await VehicleUploads.findByIdAndRemove(req.params.id);
    if (!vehicleuploads) return res.status(404).send('The vehicle with the given ID was not found.');
  
    res.send(vehicleuploads);
  });


module.exports = router;