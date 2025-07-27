
const passport=require('passport');
const {userModel}=require('../models/user');

const GoogleStrategy=require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID:process.env.GOOGLE_CLIENT_ID,
  clientSecret:process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:process.env.GOOGLE_CALLBACK_URL
},
async function(accessToken,refreshToken,profile,cb){
  try {
    console.log(profile);
    let user = await userModel.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = await userModel.create({
        name:profile.displayName,
        email:profile.emails[0].value,
      });
    }
    // 🧠 Suggestions for Best Practice
// ✅ No need to call await user.save() after create():
    await user.save();
    cb(null, user); // success // cb me pahli value err aaya ho to , dusri value control ko kaha le jana hai 
  } 
  catch (err) {
    //  cb(err, null);
    cb(err,false);
  }
}
))




passport.serializeUser(function(user,cb){
  return cb(null,user._id);// ✅ session me sirf user._id store hoga
})
// jo serializeUser me add kiya tha vo yaha pahle parametre me recieve hoga user._id -> id 
passport.deserializeUser(async function(id,cb){
  try{
    let user=await userModel.findOne({_id: id});
    cb(null,user); // ✅ har request me req.user = id attach hoga
  }
  catch(err){
    cb(err,null);
  }
});



module.exports=passport;

