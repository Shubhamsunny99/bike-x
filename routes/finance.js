const {Finance, validate} = require('../models/finances')
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({"err": 1 , "msg" : error.details[0].message});
  
    let finance = new Finance({ 
        first_name:req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        mobile: req.body.mobile,
        pincode: req.body.pincode,
        dob: req.body.dob,
        annual_income: req.body.annual_income,
        vehicle: req.body.vehicle,
    });
    finance = await finance.save();
    res.send({"err": 0, "msg": 'We have receive your request, our team will contact you soon'});
  });

router.get('/', async (req, res) => {
    const finance = await Finance.find().sort( { date: -1 } );
    res.send(finance);
  });

  router.get('/notseen', async (req, res) => {
    const finance = await Finance.find({"seen":0});
    var length = finance.length
    res.send({"total":length});
  });

  router.put('/:id', async (req, res) => {
    const finance = await Finance.findByIdAndUpdate(req.params.id,
      {
        seen:1,
    }, { new: false });
    if (!finance) return res.status(404).send('The finance with the given ID was not found.');
    res.send(finance);
  })

    // update Finance data(flag , comment , follow_up_date) by _id
router.put('/update/finance/:id' , async (req , res) => {
  let obj = {
    flag           : req.body.flag,
    comment        : req.body.comment,
    follow_up_date : req.body.follow_up_date
  }

  if(obj.flag === "" || obj.flag == undefined){
    return res.send({"err" : "1" , "msg" : "flag is required"})
  }

  let update_finance = await Finance.findByIdAndUpdate({_id : req.params.id} , obj , {new : false})
  if(!update_finance){
    return res.send({"err" : "1" , "msg" : "Given ID not found"})
  }else{
    return res.send(update_finance)
  }
})
 // filter Finance by follow_up_date
router.post('/filterby/date' , async (req, res) => {
  let finance_data = await Finance.find({follow_up_date : req.body.date})
  return res.send(finance_data)
})

module.exports = router;
