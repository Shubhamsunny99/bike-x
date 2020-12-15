const {Refurbished, validate} = require('../models/refurbishment')
const express = require('express');
const router = express.Router();
var multer  = require('multer')
const app = express();

let DIR='./attach/models';
//for file upload with multer
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,DIR)
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+ '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
  })
  
let upload = multer({ storage: storage }).single('Image');

router.post('/', async (req, res) => {
    upload(req,res,function(err)
    {
     if(err)
       {}
        else
          {
          const { error } = validate(req.body); 
          if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});

          let refurbished = new Refurbished({
           vehicle_number:req.body.vehicle_number,
           total_cost: req.body.total_cost,
           parts_changed:req.body.parts_changed,
           comments:req.body.comments,
            });           
        refurbished =  refurbished.save();
        if(err){}
          else
          {
          res.json({'err':0,'msg':'Procured', 'refurbished_list':refurbished})
          } 
      }
    });
}); 

router.get('/', async (req, res) => {
    const refurbished = await Refurbished.find();
    res.send(refurbished);
});

router.get('/latest', async (req, res) => {
  const refurbished = await Refurbished.find().sort( { date: -1 }).limit(20);
  res.send(refurbished);
});

router.get('/:id', async (req, res) => {
  const refurbish = await Refurbished.find({"vehicle_number": req.params.id});
  res.send(refurbish);
});

router.put('/:id', async (req, res) => {
  console.log(req.body.updated)
  const { error } = validate(req.body); 
  if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
  const refurbished = await Refurbished.findByIdAndUpdate(req.params.id,
    { 
      vehicle_number:req.body.vehicle_number,
      total_cost: req.body.total_cost,
      parts_changed:req.body.parts_changed,
      comments:req.body.comments,
    }, { new: false });

  if (!refurbished) return res.status(404).send('The refurbished with the given ID was not found.');
  
  res.send(refurbished);
});
router.delete('/:id', async (req, res) => {
  const refurbished = await Refurbished.findByIdAndRemove(req.params.id);

  if (!refurbished) return res.status(404).send('The refurbished with the given ID was not found.');

  res.send(refurbished);
});

module.exports = router;