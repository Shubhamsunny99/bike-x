const {VehicledisplayUploads,validate} = require('../models/bikedisplayupload')
const express = require('express');
const router = express.Router();
const multer=require('multer');
const app = express();

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

router.post('/',(req, res) => {
  upload(req,res,function(err)
    {

      if(err)
      {
        res.json( { error: err } );
      }
      else
        {
        const { error } = validate(req.body); 
        if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
            
        let vehicledisplayUploads = new VehicledisplayUploads({
              vehicle_id: req.body.vehicle_id,
              images:req.file.key,
              path:req.file.location
              });

        vehicledisplayUploads = vehicledisplayUploads.save(); //saving the banner
         if(err){}
            else
            {
               res.json({'err':0,'msg':'Tada! Vehicle Profile Uploaded'})
            }; 
        };
    });
});

router.get('/', async (req, res) => {
    const vehicledisplayuploads = await VehicledisplayUploads.find();
    res.send({"err":0,"data":vehicledisplayuploads});
  });

  router.get('/:id', async (req, res) => {
    const vehicleuploads = await VehicledisplayUploads.find({'vehicle_id': req.params.id});
    res.send({"err":0,"data":vehicleuploads});
  });
  
  router.put('/:id', async (req, res) => {
    upload(req,res,async function(err)
    {
      if(err)
      {res.json({'err':1,'msg':'Unexpected error!', err})}
      else
        {

        const vehicledisplayUploads = await VehicledisplayUploads.findByIdAndUpdate(req.params.id,
          { 
            images:req.file.key,
            path:req.file.location
          }, { new: false });
      
        if (!vehicledisplayUploads) return res.status(404).send('The vehicle with the given ID was not found.');
        
        res.send(vehicledisplayUploads);

        }
        })
  });

  router.delete('/:id', async (req, res) => {
    const vehicleuploads = await VehicledisplayUploads.findByIdAndRemove(req.params.id);
  
    if (!vehicleuploads) return res.status(404).send('The vehicle with the given ID was not found.');
  
    res.send(vehicleuploads);
  });


module.exports = router;