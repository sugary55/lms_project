import mongoose from  'mongoose';

const connect_DB = async()=>{
  try{
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`DATABASE connected successfully ${conn.connection.host}`);

    mongoose.connection.on('error',(err)=>{
      console.error(`mongo runtime error: ${err}`);
    });

    mongoose.connection.on('disconected',()=>{
      console.warn(`mongo disconnected . attempt reconect . . .`);
    })
  }
  catch(error){
    console.error(`DATABASE connection failed ${error.message}`);
    
    process.exit(1);
  }
};

export default connect_DB;
