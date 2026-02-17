import mongoose from  'mongoose';

const connect_DB = async()=>{
  try{
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`DATABASE connected successfully ${conn.connection.host}`);
  }
  catch(error){
    console.log(`DATABASE connection failed ${error.message}`);
    process.exit(1);
  }
};

export default connect_DB;
