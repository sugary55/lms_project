const errorHandler = (err,req,res,next)=>{
//500 is default error code 
//or use preset error code
const statusCode = err.statusCode || 500;
res.status(statusCode).json({
  success: false,
  message: err.message || "internal server error",
  // only show stack trace in dev mode 
  stack:process.env.NODE_ENV === 'development' ? err.stack:null,
});
};
export default errorHandler;