
const multer=require('multer');
const path=require('path');
const sharp=require('sharp');


function filefilter(req,file,cb){
const extnames=['.png','.jpeg','.jpg','.webp'];
const extension=path.extname(file.originalname);
const included=extnames.includes(extension);
if(included){
  cb(null,true);
}
else cb(new Error('Files are not allowed...',false));

}

const storage=multer.memoryStorage();
const upload=multer({storage: storage , fileFilter:filefilter,limits:{
  fileSize: 10 * 1024 *1024} });

// in bytes 

module.exports=upload;


