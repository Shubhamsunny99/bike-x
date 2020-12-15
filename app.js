const express            = require('express');
const mongoose           = require('mongoose');
var cors                 = require('cors');
const customers          = require('./routes/customer');
const vehicles           = require('./routes/vehicle');
const procurements       = require('./routes/procurement');
const modals             = require('./routes/modal');
const refurbishment      = require('./routes/refurbish');
const agents             = require('./routes/agent');
const bikeuploads        = require('./routes/bikeuploads');
const bikedisplayuploads = require('./routes/displayuploads');
const standard           = require('./routes/standardroutes');
const premium            = require('./routes/premiumroutes');
const faq                = require('./routes/faq');
const wishlist           = require('./routes/wishlists');
const procurestatus      = require('./routes/status');
const purchase           = require('./routes/purchases')
const centres            = require('./routes/centre');
const sells              = require('./routes/sell');
const finance            = require('./routes/finance');
const uploadStatus       = require('./routes/uploadstatus');
const fetchVehicle       = require('./routes/fetchdata');
const megaFile           = require('./routes/megaJson');
const agentActivity      = require('./routes/agentActivities');
const loggedIn           = require('./routes/loggedin');
const banneruploads      = require('./routes/banners');
const sendmessage        = require('./routes/sendmessage');
const featuredbike       = require('./routes/featuredbike');
const designation        = require('./routes/designation');
const docs               = require('./routes/document');
const enquiry            = require('./routes/enquiries');
const squad              = require('./routes/squadVoice');
const broker             = require('./routes/brokers');
const apiModelList       = require('./routes/ApiModelsList');
const apiList            = require('./routes/apiLists');
const vehicle_doc        = require('./routes/vehicle_doc');
const broker_task        = require('./routes/broker_task');
const dispenser          = require('./routes/dispenser');
const otr_models         = require('./routes/otrModel');
const dealer             = require('./routes/dealer');
const variant            = require('./routes/variant');
const otr_customer       = require('./routes/otrCustomer');
const otr_order          = require('./routes/otrOrder');
const otr_banner         = require('./routes/otr_banner');
const otr_login          = require('./routes/logins');

const app = express();
app.use(express.json());
app.use(cors())
// app.use('/myImages',express.static('attach'));


mongoose.connect('mongodb+srv://bikex:bikex2019@bikex-g6pzj.gcp.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

  app.use('/api/customers', customers);
  // app.use('/api/vehicles', vehicles);
  app.use('/api/procurements', procurements);
  app.use('/api/models', modals);
  app.use('/api/refurbished', refurbishment);
  app.use('/api/agents', agents);
  app.use('/api/uploads', bikeuploads);
  app.use('/api/banners', banneruploads);
  app.use('/api/upload-display', bikedisplayuploads);
  app.use('/api/uploadstatus', uploadStatus);
  app.use('/api/standard', standard);
  app.use('/api/fetch/', fetchVehicle);
  app.use('/api/premium', premium);
  app.use('/api/faq', faq);
  app.use('/api/document', docs);
  app.use('/api/wishlist', wishlist);
  app.use('/api/sell', sells);
  app.use('/api/designation', designation);
  app.use('/api/featured', featuredbike);
  app.use('/api/sendmessage', sendmessage);
  app.use('/api/finance', finance);
  app.use('/api/centres', centres);
  app.use('/api/purchases', purchase);
  app.use('/api/procurestatus', procurestatus);
  app.use('/api/vehicle', megaFile);
  app.use('/api/agent-activity',agentActivity);
  app.use('/api/logged-in', loggedIn);
  app.use('/api/enquiry', enquiry);
  app.use('/api/squadVoice', squad)
  app.use('/api/broker', broker)
  app.use('/api/apiModel', apiModelList)
  app.use('/api/apiList', apiList)
  app.use('/api/upload-docs', vehicle_doc)
  app.use('/api/broker-task', broker_task)
  app.use('/api' , dispenser)
  app.use('/api/otr_models' , otr_models)
  app.use('/api/otr_dealer' , dealer)
  app.use('/api/otr_variant' , variant)
  app.use('/api/otr_customer' , otr_customer)
  app.use('/api/otr_purchase' , otr_order)
  app.use('/api/otr_banner' , otr_banner)
  app.use('/api/otr_login' , otr_login)


  app.get('/', (req, res)=>{
    res.send('you are not authorized to view this page')
  })




const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));