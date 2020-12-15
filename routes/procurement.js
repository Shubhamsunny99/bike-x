const {Procured, validate} = require('../models/procurements')
const express = require('express');
const router = express.Router();
var multer  = require('multer')
const app = express();
var _ = require('lodash');


let DIR='./attach/documents';
//for file upload with multer
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,DIR)
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+ '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
  })
  
let upload = multer({ storage: storage }).array('Image');

router.post('/', async (req, res) => {
    upload(req,res,async function(err)
    {
      var documents = []
      for (var i in req.files){
       documents.push(req.files[i].filename)
      }

     if(err)
       {}
        else
          {
          const { error } = validate(req.body); 
          if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});

          const procured_list = await Procured.find();
          const id = _.findLast(procured_list, function(n) {
            return n.vehicle_id;
          });
          if(!id){ids = 10001}
          else{ids = id.vehicle_id}

          let procured = new Procured({
            vehicle_id : Number(ids)+1,
            vehicle_number:req.body.vehicle_number,
            model_id:req.body.model_id,
            type:req.body.type,
            manufacture_year:req.body.manufacture_year,
            color:req.body.color,
            fines: req.body.fines,
            source: req.body.source,
            city: req.body.city,
            pincode: req.body.pincode,
            state: req.body.state,
            address:req.body.address,
            rc_card: req.body.rc_card,
            insurance:req.body.insurance,
            b_extract:req.body.b_extract,
            hypothecation:req.body.hypothecation,
            noc:req.body.noc,
            documents:documents,
            regn_no:req.body.regn_no,
            chassis_no:req.body.chassis_no,
            insurance_policy_number:req.body.insurance_policy_number,            
            rc_start:req.body.rc_start,
            rc_end:req.body.rc_end,
            insurance_start:req.body.insurance_start,
            insurance_end:req.body.insurance_end,
            remarks: req.body.remarks,
            procured_date: req.body.procured_date,
            procured_price: req.body.procured_price,
            registration_cost: req.body.registration_cost,
            km_reading: req.body.km_reading,
            selling_price: req.body.selling_price,
            });           
        procured =  procured.save();
        if(err){}
          else
          {
          res.json({'err':0,'msg':'Procured', 'procured_list':procured})
          } 
      }
    });
});

router.get('/', async (req, res) => {
    const procured = await Procured.find().sort( { date: -1 });
    res.send(procured);
});

router.get('/:id', async (req, res) => {
  const procured = await Procured.find({'vehicle_id': req.params.id});
  res.send(procured);
});


router.post('/addVehicle', async (req, res) => {
  const procured = await Procured.findOne({'regn_no': req.body.regn_no});
  if(!procured){
    const { error } = validate(req.body); 
          if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});

          const procured_list = await Procured.find();
          const id = _.findLast(procured_list, function(n) {
            return n.vehicle_id;
          });
          if(!id){ids = 10001}
          else{ids = id.vehicle_id}

          let procured = new Procured({
            vehicle_id : Number(ids)+1,
            vehicle_number:req.body.vehicle_number,
            model_id:req.body.model_id,
            type:req.body.type,
            manufacture_year:req.body.manufacture_year,
            color:req.body.color,
            fines: req.body.fines,
            source: req.body.source,
            city: req.body.city,
            pincode: req.body.pincode,
            state: req.body.state,
            address:req.body.address,
            rc_card: req.body.rc_card,
            insurance:req.body.insurance,
            b_extract:req.body.b_extract,
            hypothecation:req.body.hypothecation,
            noc:req.body.noc,
            documents:req.body.documents,
            regn_no:req.body.regn_no,
            chassis_no:req.body.chassis_no,
            insurance_policy_number:req.body.insurance_policy_number,            
            rc_start:req.body.rc_start,
            rc_end:req.body.rc_end,
            insurance_start:req.body.insurance_start,
            insurance_end:req.body.insurance_end,
            remarks: req.body.remarks,
            procured_date: req.body.procured_date,
            procured_price: req.body.procured_price,
            registration_cost: req.body.registration_cost,
            km_reading: req.body.km_reading,
            selling_price: req.body.selling_price,
            });           
        procured =  procured.save();
        if(err){
          res.send({'err':1,msg:`Internal Server Error`,'msg':err})
        }
          else
          {
          res.json({'err':0,'msg':'Procured', 'procured_list':procured})
          } 
  }else{
    res.send({err:1,msg:`Vehicle ${procured.vehicle_id} already has this registration no ${req.body.regn_no}.`})
  }
});

router.get('/getVehicles/all', async (req, res) => {
  const procured = await Procured.find().sort( { date: -1 });
  res.send(procured);
});

router.put('/update/:id', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
    { 
            vehicle_number:req.body.vehicle_number,
            model_id:req.body.model_id,
            type:req.body.type,
            manufacture_year:req.body.manufacture_year,
            color:req.body.color,
            fines: req.body.fines,
            source: req.body.source,
            city: req.body.city,
            pincode: req.body.pincode,
            state: req.body.state,
            address:req.body.address,
            rc_card: req.body.rc_card,
            insurance:req.body.insurance,
            b_extract:req.body.b_extract,
            noc:req.body.noc,
            hypothecation:req.body.hypothecation,
            documents:req.body.documents,
            regn_no:req.body.regn_no,
            chassis_no:req.body.chassis_no,
            insurance_policy_number:req.body.insurance_policy_number,            
            rc_start:req.body.rc_start,
            rc_end:req.body.rc_end,
            insurance_start:req.body.insurance_start,
            insurance_end:req.body.insurance_end,
            remarks: req.body.remarks,
            procured_date: req.body.procured_date,
            procured_price: req.body.procured_price,
            selling_price: req.body.selling_price,
            registration_cost: req.body.registration_cost,
            km_reading: req.body.km_reading,

      updated: req.body.updated
    }, { new: false });

  if (!procured) return res.status(404).send('The procured with the given ID was not found.');
  
  res.send(procured);
});


router.post('/checkregistration', async (req, res) => {
  const procured = await Procured.findOne({'regn_no': req.body.registration});
  if(!procured){
    res.send({err: 0,msg:'Registration number verified.'})
  }else{
    res.send({err:1,msg:`Vehicle ${procured.vehicle_id} already has this registration no.`})
  }
}); 

router.put('/:id', async (req, res) => {
  var documents = []
      for (var i in req.files){
       documents.push(req.files[i].filename)
      } 
  console.log(req.body.updated)
  const { error } = validate(req.body); 
  if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
    { 
      vehicle_number:req.body.vehicle_number,
            model_id:req.body.model_id,
            type:req.body.type,
            manufacture_year:req.body.manufacture_year,
            color:req.body.color,
            fines: req.body.fines,
            source: req.body.source,
            city: req.body.city,
            pincode: req.body.pincode,
            state: req.body.state,
            address:req.body.address,
            rc_card: req.body.rc_card,
            insurance:req.body.insurance,
            b_extract:req.body.b_extract,
            noc:req.body.noc,
            hypothecation:req.body.hypothecation,
            documents:documents,
            regn_no:req.body.regn_no,
            chassis_no:req.body.chassis_no,
            insurance_policy_number:req.body.insurance_policy_number,            
            rc_start:req.body.rc_start,
            rc_end:req.body.rc_end,
            insurance_start:req.body.insurance_start,
            insurance_end:req.body.insurance_end,
            remarks: req.body.remarks,
            procured_date: req.body.procured_date,
            procured_price: req.body.procured_price,
            selling_price: req.body.selling_price,
            registration_cost: req.body.registration_cost,
            km_reading: req.body.km_reading,

      updated: req.body.updated
    }, { new: false });

  if (!procured) return res.status(404).send('The procured with the given ID was not found.');
  
  res.send(procured);
});


router.get('/check_availability/:id', async (req, res) => {
  const procured = await Procured.findOne({"vehicle_id":req.params.id}).populate({
      path:'model_id',
      select:''
  });
  if(!procured){
      res.status(404).send({"msg":"vehicle not found."});
  }else{
      res.send(procured);
  }
});



router.delete('/:id', async (req, res) => {
  const procured = await Procured.findByIdAndRemove(req.params.id);

  if (!procured) return res.status(404).send('The procured with the given ID was not found.');

  res.send(procured);
});

router.put('/form_26/:id', async (req, res) => {
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
  {
    form_26: req.body.form_26
  }, { new: false });
  res.send(procured);
});

router.put('/form_28/:id', async (req, res) => {
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
  {
    form_28: req.body.form_28
  }, { new: false });
  res.send(procured);
});

router.put('/form_29/:id', async (req, res) => {
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
  {
    form_29: req.body.form_29
  }, { new: false });
  res.send(procured);
});

router.put('/form_30/:id', async (req, res) => {
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
  {
    form_30: req.body.form_30
  }, { new: false });
  res.send(procured);
});

router.put('/form_34/:id', async (req, res) => {
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
  {
    form_34: req.body.form_34
  }, { new: false });
  res.send(procured);
});

router.put('/form_35/:id', async (req, res) => {
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
  {
    form_35: req.body.form_35
  }, { new: false });
  res.send(procured);
});

router.put('/form_36/:id', async (req, res) => {
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
  {
    form_36: req.body.form_36
  }, { new: false });
  res.send(procured);
});

router.put('/hypothecation/:id', async (req, res) => {
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
  {
    hypothecation: req.body.hypothecation
  }, { new: false });
  res.send(procured);
});
router.put('/insurance/:id', async (req, res) => {
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
  {
    insurance: req.body.insurance
  }, { new: false });
  res.send(procured);
});
router.put('/b_extract/:id', async (req, res) => {
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
  {
    b_extract: req.body.b_extract
  }, { new: false });
  res.send(procured);
});
router.put('/rc_card/:id', async (req, res) => {
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
  {
    rc_card: req.body.rc_card
  }, { new: false });
  res.send(procured);
});
router.put('/noc/:id', async (req, res) => {
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
  {
    noc: req.body.noc
  }, { new: false });
  res.send(procured);
});
router.put('/doc_status/:id', async (req, res) => {
  const procured = await Procured.findOneAndUpdate({'vehicle_id': req.params.id},
  {
    doc_status: req.body.doc_status
  }, { new: false });
  res.send(procured);
});
module.exports = router;