const User = require("../models/Usermodels");
const axios = require("axios");

const Jobmodel = require("../models/Jobmodel");
const cloudinary = require("cloudinary");

exports.register = async (req, res,latitude,longitude) => {
  try {
    const { name, email, password, number } = req.body;

    if (!name || !email || !password || !number) {
      return res.status(404).json({
        success: false,
        msg: "please enter all credentials",
      });
    }
    const isemailexits = await User.findOne({ email });
    if (isemailexits) {
      return res.status(404).json({
        success: false,
        msg: "user already exits",
      });
    }
    const numberexits = await User.findOne({ number });
    if (numberexits) {
      return res.status(404).json({
        success: false,
        msg: "number already exits",
      });
    }

    //  const myCloud=await cloudinary.v2.uploader.upload(avatar,{
    //   folder:"helperavtar"
    //  })
   

     const user = await User.create({
    name,
       email,
      password,
       number,

       // avatar:{
    //    public_id:myCloud.public_id,
      //   url:myCloud.secure_url
       //  }
   });
    const token = await user.generatetoken();
    await user.save();
    return res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.json({
      sucess: false,
      msg: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { number, password } = req.body;
    if (!number || !password) {
      res.status(404).json({
        success: false,
        msg: "please enter all credential",
      });
    }
    const user = await User.findOne({ number }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "user does not exits",
      });
    }
    const isMatch = await user.matchpassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "password does not match",
      });
    }
    const token = await user.generatetoken();

    return res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .json({
        success: true,
        token,
      });
  } catch (error) {
    return res.json({
      msg: error.message,
    });
  }
};
exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "logout successfully",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, email } = req.body;
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: "profile change successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatepassword = async (req, res) => {
  try {
    const { oldpassword, newpassword, confirmpassword } = req.body;
    if (!oldpassword || !newpassword || !confirmpassword) {
      return res.json({
        msg: "please submit all credential",
      });
    }
    if (newpassword != confirmpassword) {
      return res.json({
        msg: "enter same password",
      });
    }
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({
        msg: "please login first",
      });
    }
    const isMatch = await user.matchpassword(oldpassword);
    if (!isMatch) {
      return res.json({
        msg: "password does not match",
      });
    }
    user.password = newpassword;
    await user.save();
    return res.status(200).json({
      msg: "password changes successfully",
    });
  } catch (error) {
    return res.json({
      msg: error,
    });
  }
};
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        msg: "please login first",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.json({
      msg: error,
    });
  }
};

exports.AddSkillOfProvider = async (req, res) => {
  try {
    const skillsArray = req.body;

    const skillsArrayValues = Object.values(skillsArray);

    if (!skillsArray) {
      return res.json({
        msg: "please enter message",
      });
    }
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        msg: "please login first",
      });
    }

    await user.skills.push(...skillsArrayValues);

    await user.save();

    res.status(200).json({
      success: true,

      user,
    });
  } catch (error) {
    res.json({
      msg: error.message,
    });
  }
};

exports.UpdateSkillOfProvider = async (req, res) => {
  try {
    const skillsArray = req.body;

    const skillsArrayValues = Object.values(skillsArray);

    if (!Array.isArray(skillsArrayValues) || skillsArrayValues.length === 0) {
      return res.json({
        msg: "Please provide a non-empty array of skills.",
      });
    }
    if (!skillsArray) {
      return res.json({
        msg: "please enter message",
      });
    }
    const user = await User.findById(req.user._id);
    const uniqueSkills = [...new Set(skillsArrayValues.flat())];

    if (!user) {
      return res.status(404).json({
        msg: "please login first",
      });
    }

    // Add new skills to the user's skills array
    user.skills = uniqueSkills;

    await user.save();

    res.status(200).json({
      success: true,

      user,
    });
  } catch (error) {
    res.json({
      msg: error.message,
    });
  }
};

exports.AddEducation = async (req, res) => {
  try {
    const educationArray = req.body;

    const educationArrayValues = Object.values(educationArray);

    if (!educationArray) {
      return res.json({
        msg: "please enter message",
      });
    }
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        msg: "please login first",
      });
    }

    await user.qualification.push(...educationArrayValues);

    await user.save();

    res.status(200).json({
      success: true,

      data: user.qualification,
    });
  } catch (error) {
    res.json({
      msg: error.message,
    });
  }
};

exports.updateEducation = async (req, res) => {
  try {
    const educationsArray = req.body;

    const eudcationArrayValues = Object.values(educationsArray);

    if (
      !Array.isArray(eudcationArrayValues) ||
      eudcationArrayValues.length === 0
    ) {
      return res.json({
        msg: "Please provide a non-empty array of skills.",
      });
    }
    if (!educationsArray) {
      return res.json({
        msg: "please enter message",
      });
    }
    const user = await User.findById(req.user._id);
    const uniqueSkills = [...new Set(eudcationArrayValues.flat())];

    if (!user) {
      return res.status(404).json({
        msg: "please login first",
      });
    }

    // Add new skills to the user's skills array
    user.qualification = uniqueSkills;

    await user.save();

    res.status(200).json({
      success: true,

      user,
    });
  } catch (error) {
    res.json({
      msg: error.message,
    });
  }
};
exports.connections = async (req, res) => {
  try {
    const usertofollow = await User.findById(req.params.id);
    if (!usertofollow) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    const loggedinuser = await User.findById(req.user._id);
    if (!loggedinuser) {
      return res.status(404).json({
        success: false,
        message: "please login first",
      });
    }
    if (loggedinuser.following.includes(usertofollow._id)) {
      const indexoffollowing = loggedinuser.following.indexOf(usertofollow._id);
      loggedinuser.following.splice(indexoffollowing, 1);
      const indexfollower = usertofollow.follower.indexOf(loggedinuser._id);
      usertofollow.follower.splice(indexfollower, 1);
      await usertofollow.save();
      await loggedinuser.save();

      res.status(200).json({
        success: true,
        message: "User Unfollowed",
      });
    } else {
      loggedinuser.following.push(usertofollow._id);
      usertofollow.follower.push(loggedinuser._id);
      await loggedinuser.save();
      await usertofollow.save();
      res.status(200).json({
        success: true,
        message: "User followed",
      });
    }
  } catch (error) {
    res.json({
      msg: error.message,
    });
  }
};

exports.updateworkrole = async (req, res) => {
  try {
    const { value } = req.body;

    if (!value) {
      return res.json({
        msg: "Please provide a work role",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        msg: "Please login first",
      });
    }

    if (user.work === value) {
      return res.status(400).json({
        msg: "Same work role, no changes made",
      });
    }

    user.work = value;

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

exports.allUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const userfollowing = await User.find({
      _id: { $in: user.following },
    }).populate("skills");
    console.log(userfollowing);
    if (!user) {
      return res.status(404).json({
        msg: "Please login first",
      });
    }
    return res.status(200).json({
      userfollowing,
      msg: "all post geted",
    });
  } catch (error) {
    return res.status(400).json({
      msg: error.message,
    });
  }
};

exports.addLocation = async (req, res) => {
  const userId = req.user._id; // Assuming userId is part of the route parameters
  // Assuming you are sending longitude and latitude in the request body

  try {
    const response = await axios.get("http://ipinfo.io/json");
    const { loc } = response.data;
    const [longitude, latitude] = loc.split(",").map(parseFloat);
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found");
      return;
    }
    user.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
    console.log(loc[0]);
    await user.save();
    res.status(200).json({
      success: true,
      data: user.location,
    });
  } catch (error) {
    return res.status(400).json({
      msg: error.message,
    });
  }
};

exports.addjobtitle = async (req, res) => {
  try {
    const { job } = req.body;
    if (!job) {
      return res.status(400).json({
        msg: "please enter message",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "please loggin first",
      });
    }
    if (user.work === "provider") {
      user.jobtitle = job;
    } else {
      res.json({
        msg: "you are a consumer you cant add job title",
      });
    }

    await user.save();
    res.status(200).json({
      success: false,
      msg: "job added",
      data: user.jobtitle,
    });
  } catch (error) {
    return res.json({
      msg: error.message,
    });
  }
};

exports.createjob = async (req, res) => {
  try {
    const { jobtitle, description } = req.body;
    if (!jobtitle || !description) {
      return res.status(404).json({
        msg: "please enter all of the credentials",
      });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        msg: "user doesnot exits",
      });
    }

    const newjob = await Jobmodel.create({
      ProviderId: user.id,
      jobTitle: jobtitle,
      //  location: locationofuser,
      
      Description: description,
    });
    user.ProvideJob.push(newjob);
    await user.save();
    return res.status(200).json({
      msg: "job created successfully",
      newjob,
    });
  } catch (error) {
    return res.status(404).json({
      msg: error.message,
    });
  }
};
exports.findalljob = async (req, res) => {
  try {
    const alljob = await Jobmodel.find().populate("ProviderId");
    return res.status(200).json({
      msg: "getall job",
      alljob,
    });
  } catch (error) {
    return res.status(404).json({
      msg: error.message,
    });
  }
};
exports.deletejoboffer = async (req, res) => {
  try {
    const jobtodelete = await Jobmodel.findById(req.params.id);
    if (!jobtodelete) {
      return res.status(400).json({
        msg: "cannot find job",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        msg: "user doesnot exits",
      });
    }
    if (!jobtodelete.ProviderId === user.id) {
      return res.status(404).json({
        msg: "you did not created this job",
      });
    }
    const index = user.ProvideJob.indexOf(jobtodelete._id);

    user.ProvideJob.splice(index, 1);
    await user.save();
    // Delete the job from the Jobmodel
    await Jobmodel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      msg: "job successfully deleted",
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

exports.findjob = async (req, res) => {
  try {
   const jobTitle=req.query.jobTitle
  
   const job = await Jobmodel.find({ jobTitle: { $regex: jobTitle, $options: 'i' } }); // Case-insensitive regex search
  //  const jobs = await Job.find({ jobTitle: { $regex: new RegExp(jobTitle, 'i') } });

   res.json({ success: true, job });
 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.myprofile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "please login first",
      });
    }
    res.json({
      user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: error.message,
    });
  }
};
