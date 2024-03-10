const mongoose =require("mongoose")
const bcrypt=require("bcrypt")
const geolocation=require("geolocation")
const axios =require("axios")
const jwt = require("jsonwebtoken")
const JWT_SECRET="harshjhaekchutiyainsaanhai"
const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        select:false,

    },
    avatar: {
      public_id: String,
      url: String,
    },
    email:{
        type:String,
        unique:true,

    },
    number:{
        type:String,
         required:true,
         index:true

    },
    role:{
        type:String,
       default:"User"

    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
  
       
      },
      coordinates: {
        type: [Number],
       
    
      },
    },
    skills :[
        { 
          type: [String],
      

        }
    ],
    qualification:[
        {
            type:[String]
        }
    ],
    experience:{
        type:Number,
        
    },
    ratings:{
        type:Number,
        default:0
    },
    follower: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    avatar: {
      public_id: String,
      url: String,
    },
      work:{
          type:String,
          
      },
      jobtitle:{
        type:String,
       
      },
      ProvideJob:
      
      [
        {
  
          type:mongoose.Schema.ObjectId,
          ref:"Job"
        
       
      },
      ],
      reviews: [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          rating: {
            type: Number,
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ],
})

// userschema.index({ email: 1 }, { unique: true }); // Unique index on email
// userschema.index({ number: 1 }, { unique: true }); // Unique index on number
// userschema.index({ location: "2dsphere" }); // Geospatial index on location.coordinates
// userschema.index({ skills: 1 }); // Index on skills array
// userschema.index({ qualification: 1 }); // Index on qualification array

userschema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10)

    }
    next()
})

userschema.methods.findlocation=async function(){
// const response=await axios.getAdapter('http://ipinfo.io/json')
// const { loc } = response.data;
// const [longitude, latitude] = loc.split(',').map(parseFloat)
if (navigator.geolocation) {
  // Request the current position
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // Extract latitude and longitude from the position object
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Construct the Geocoding API request URL
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

      // Make a request to the Geocoding API
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          // Extract the formatted address from the response
          const formattedAddress = data.results[0].formatted_address;
          console.log('Current Address:', formattedAddress);
        })
        .catch(error => {
          console.error('Error fetching location:', error);
        });
    },
    (error) => {
      console.error('Error getting location:', error.message);
    }
  );
 
} else {
  console.error('Geolocation is not supported by your browser');
}

}
userschema.methods.matchpassword=async function(password){
    return await bcrypt.compare(password,this.password)

}
userschema.methods.generatetoken=async function(){
  return  jwt.sign({_id:this._id},JWT_SECRET)

}
module.exports=mongoose.model("User",userschema)