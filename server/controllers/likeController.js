const catchAsync = require("../utils/catchAsync");
const Like = require("../models/likeModel");
const Post=require("../models/postModel");
const AppError=require("../utils/appError");
exports.giveLike = catchAsync(async (req, res,next) => {
  const alreadyLiked=await Like.findOne({user:req.user._id,post:req.params.postId});
  if(alreadyLiked){
    return next(new AppError("You already liked the post",400));
  }
  let like = await Like.create({
    user: req.user._id,
    post: req.params.postId,
  });
let post=await Post.findById(req.params.postId).populate("user");
let message;
console.log(post?.user?._id.equals(req.user._id),post.user._id,req.user._id)
if(post?.user?._id.equals(req.user._id)){
    message=`You like your post`;

}else{
      message= `You gived a like to ${post?.user?.name} post`;

}
  res.status(200).json({
    success: true,
    message,
    like
  });
});
exports.getAllLikeOfPost = catchAsync(async (req, res) => {
  const allLike = await Like.find({ post: req.params.postId }).populate("user");
  res.status(200).json({
    success: true,
    likeLen: allLike.length,
    allLike,
  });
});
