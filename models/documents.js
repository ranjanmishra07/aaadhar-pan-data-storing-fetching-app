var mongoose =require('mongoose');

var documentSchema=mongoose.Schema({
        drivingLicenceNumber:{
            type:String,
            rquired:[true,'licence number is required  field is required '],
            minlength:[4,'length cannot be less than 4'],
            
        },
        drivingLicenceName:{
         type:String,
         trim:true,
         required:[true,'name on driving licence is required '],
         minlength:[4,'namelenth  cannot be shorter than 4']

        },
        vehicle:{
         type:String,
         trim:true
        },
        drivingLicenceDOB:{
         type:String,
         required:[true,'dob is required']

        },
        drivingCategory:{
            type:String
        },
       aadharNumber:{
           type:Number,
           trim:true,
           required:[true,'aadhar number is required '],
           minlength:[10,'aadhar number should be 10 digit']
       },
       aadharName:{
           type:String,
           trim:true,
           required:[true,'aadhar holders name cant be empty'],
           minlength:[4,'length cant be shorter than 4']

       },
       aadharCardDOB:{
           type:String,
           required:[true,'dob is required']
       }
   

}) 

var Document = module.exports = mongoose.model('Document', documentSchema);