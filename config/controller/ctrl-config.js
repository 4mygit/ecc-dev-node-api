const express = require('express');
const sql = require('mssql/msnodesqlv8');


var config = require('../model/model-db');

/*
var config = {

    server : "localhost\\ECC", // eg:: 'DESKTOP_mjsi\\MSSQLEXPRESS'
   databse: "ECCDB",
   driver:"msnodesqlv8",
   user :'corp\\anudasgu',      // please read above note
   password:"Hydrogen1234",   // please read above note
  options :{
    trustedConnection:true,
  }
}
*/



const login = (req,res)=>{
  //ruleid = req.body.ruleid

  username = req.body.uid
  password = req.body.pass

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
     //make the query
  
     //var query = "SELECT [buildingname] as building FROM [ECCDB].[ECCAnalytics].[Buildings]"
     dbName = config.databse
    query = "SELECT * FROM ["+dbName+"].ECCAnalytics.Users where username ='"+username+ "' and pswd ='"+password+"'"
     request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
             //res.send(records['recordsets'][0]);
             //  your out put as records  
         // return res.status(200).json(records['recordsets'][0])
         if(records['recordsets'][0].length !=0){
         data = {'userid': records['recordsets'][0][0].username,'mailid': records['recordsets'][0][0].useremailid, 'roles': records['recordsets'][0][0].roles, 'loginstatus': records['recordsets'][0][0].loginstatus}
         console.log(records['recordsets'][0][0].username)
         return res.status(200).json(data)
        }
         else   
         data = {'status':'No Data Found'}
          return res.status(200).json(data)
      }
  
      }
  
  )
  })
}



const closealarm = (req,res)=>{
    alarmid = req.body.alarmid
    ruleno = req.body.ruleno
    ruleid = req.body.ruleid

    query = "update  Alarm set [Alarm].[alarmstatus] = 0, [Alarm].[alarmofftimestamp] = CURRENT_TIMESTAMP from [ECCDB].[ECCAnalytics].[Alarm] Alarm where [Alarm].[alarmid] = "+alarmid+"; "
    query2 = " update  Ruletimer set [Ruletimer].[timer] = 0 from [ECCDB].[ECCAnalytics].[Ruletimer] Ruletimer where [Ruletimer].[workflowname] = '"+ruleno+"' and [Ruletimer].[ruleid] = "+ruleid+";"

    query = query + query2


    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        var request = new sql.Request();
    
        request.query(query,function(err,records){
            if(err)
            console.log(query);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
              // var data = [];
           // return res.status(200).json(records['recordsets'][0])
          // console.log(records['recordsets'][0])
            return res.status(200).json({'status': 'success'})
        }
    
        }
    
    )
    })


}


const projview = (req,res)=>{
    //ruleid = req.body.ruleid
    dbName = config.databse


    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        // make a request as
    
        var request = new sql.Request();
    
       //make the query
    
       //var query = "SELECT [buildingname] as building FROM [ECCDB].[ECCAnalytics].[Buildings]"
       query = "SELECT [recordid] ,[projname],[projdesc],[countryname],[countrydesc],[cityname],[citydesc],[campusname],[campusdesc],[buildingname],[buildingdesc],[equipmentname],[equipmentid],[associatedequipid],[associatedequipdesc],[users]  FROM ["+dbName+"].[ECCAnalytics].[Project]"
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
           // return res.status(200).json(records['recordsets'][0])
            var data = [];
            for (var i = 0; i < records['recordsets'][0].length; i++) { 
             data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmentid: records['recordsets'][0][i]['equipmentid'],associatedequipid: records['recordsets'][0][i]['associatedequipid'],associatedequipdesc: records['recordsets'][0][i]['associatedequipdesc']});
             //DATA.    ({'recordid': row[0],'projname': row[1],'projdesc' : row[2],'countryname' : row[3],'countrydesc' : row[4],'cityname' : row[5],'citydesc' : row[6],'campusname' : row[7],'campusdesc' : row[8],'buildingname' : row[9],'buildingdesc' : row[10],'equipmentname' : row[11],'equipmenttype' : row[12],'subequipmentname' : row[13],'subequipmentdesc' : row[14]})
            }

            return res.status(200).json(data)
        }
    
        }
    
    )
    })
}


const deleteproject = (req,res)=>{

  query = ""
  if (typeof req.query.cn !== 'undefined') {
    dbName = config.databse
    query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [countryname] = '"+req.query.cn+"'";
    //return res.status(200).json(query)

  }

  if (typeof req.query.ct !== 'undefined') {
    dbName = config.databse
    query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [cityname] = '"+req.query.ct+"'";
    //return res.status(200).json(query)

  }

  if (typeof req.query.cm !== 'undefined') {
    dbName = config.databse
    query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [campusname] = '"+req.query.cm+"'";
    //return res.status(200).json(query)

  }

  if (typeof req.query.bl !== 'undefined') {
    dbName = config.databse
    query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [buildingname] = '"+req.query.bl+"'";
    //return res.status(200).json(query)

  }


  if (typeof req.query.eq !== 'undefined') {
    dbName = config.databse
    query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [equipmentname] = '"+req.query.eq+"'";
    //return res.status(200).json(query)

  }


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      var request = new sql.Request();
  
      request.query(query,function(err,records){
          if(err){
          console.log(query);
          return res.status(200).json('failed')

          }else{
                  
            console.log('success');
            return res.status(200).json('success')

          }
      
  
      })
  })


}




const postprojectview = (req,res)=>{

  dbName = config.databse
  projname = req.body.projname
  projdesc = req.body.projdesc
  countryname = req.body.countryname
  countrydesc = req.body.countrydesc
  cityname = req.body.cityname
  citydesc = req.body.citydesc
  campusname = req.body.campusname
  campusdesc = req.body.campusdesc
  buildingname = req.body.buildingname
  buildingdesc = req.body.buildingdesc
  equipmentname = req.body.equipmentname
  equipmentid = req.body.equipmentid
  associatedequipid = req.body.associatedequipid
  associatedequipdesc = req.body.associatedequipdesc
  users = req.body.users


  //query = "INSERT INTO ["+dbName+"].ECCAnalytics.Project ( projname, projdesc,countryname,countrydesc,cityname,citydesc,campusname,campusdesc,buildingname,buildingdesc,equipmentname,equipmenttype,subequipmentname,subequipmentdesc,users) VALUES ('"+projname+"','"+projdesc+"','"+countryname+"','"+countrydesc+"','"+cityname+"','"+citydesc+"','"+campusname+"','"+campusdesc+"','"+buildingname+"','"+buildingdesc+"','"+equipmentname+"','"+equipmenttype+"','"+subequipmentname+"','"+subequipmentdesc+"',"+users+");"
  query = "INSERT INTO ["+dbName+"].ECCAnalytics.Project ( projname, projdesc,countryname,countrydesc,cityname,citydesc,campusname,campusdesc,buildingname,buildingdesc,equipmentname,equipmentid,associatedequipid,associatedequipdesc,users) VALUES ('"+projname+"','"+projdesc+"','"+countryname+"','"+countrydesc+"','"+cityname+"','"+citydesc+"','"+campusname+"','"+campusdesc+"','"+buildingname+"','"+buildingdesc+"','"+equipmentname+"','"+equipmentid+"','"+associatedequipid+"','"+associatedequipdesc+"',"+users+");"

    //return res.status(200).json(query)
    //query2 = "INSERT INTO ["+dbName+"].[ECCAnalytics].[Task] ([taskid],[alarmid],[taskname],[taskpriority],[taskassigneddate],[buildingname],[subequipmenttype],[taskstatus],[escalationstage]) VALUES ('"+taskid.toString()+"',"+req.body.alarmid.toString()+",'"+req.body.taskname.toString()+"','Low', CURRENT_TIMESTAMP,'"+req.body.buildingname.toString()+"','"+req.body.equipmentname.toString()+"','1','Stage1');"


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      var request = new sql.Request();
  
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
                  
            //console.log('success');
            return res.status(200).json('success')

          }
      
  
      })
  })


}





const deleteuser = (req,res)=>{

  query = ""
  if (typeof req.query.id !== 'undefined') {
    dbName = config.databse
    query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Users] where [userid] = '"+req.query.id+"'";
    //return res.status(200).json(query)

  }



  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      var request = new sql.Request();
  
      request.query(query,function(err,records){
          if(err){
          console.log(query);
          return res.status(200).json('failed')

          }else{
                  
            console.log('success');
            return res.status(200).json('success')

          }
      
  
      })
  })


}




const updateuser = (req,res)=>{

  dbName = config.databse
  username = req.body.username
  query = ""
  if (typeof req.body.roles !== 'undefined') {
    dbName = config.databse
    username = req.body.username

    query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [roles] = '"+req.body.roles+"'where username = '"+username+"'";

  }


  if (typeof req.body.pswd !== 'undefined') {
    pswd = req.body.pswd

   query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"' where username = '"+username+"'";

  }


  if (typeof req.body.pswd !== 'undefined' && typeof req.body.roles !== 'undefined') {
    pswd = req.body.pswd

   query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"', [roles] = '"+req.body.roles+"' where username = '"+username+"'";

  }

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      var request = new sql.Request();
  
      request.query(query,function(err,records){
          if(err){
          console.log(query);
          return res.status(200).json('failed')

          }else{
                  
            console.log('success');
            return res.status(200).json('success')

          }
      
  
      })
  })


}





const getbuilding = (req,res)=>{
  cm = req.query.cm
  dbName = config.databse

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     query = "SELECT [recordid],[buildingname] as building FROM ["+dbName+"].[ECCAnalytics].[Buildings] where campusname = '"+cm+"'"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
/*
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
          }
*/
          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}


const getcampus = (req,res)=>{
  ct = req.query.ct
  dbName = config.databse

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     query = "SELECT [recordid],[campusname] as campus FROM ["+dbName+"].[ECCAnalytics].[Campuses] where cityname = '"+ct+"'"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
/*
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
          }
*/
          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}


const getcity = (req,res)=>{
  cn = req.query.cn
  dbName = config.databse

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     query = "SELECT [recordid],[cityname] FROM ["+dbName+"].[ECCAnalytics].[Cities] where countryname = '"+cn+"'"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
/*
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
          }
*/
          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}



const getcountry = (req,res)=>{
  cn = req.query.cn
  dbName = config.databse

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
/*
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
          }
*/
          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}


const getdevices = (req,res)=>{
  dbName = config.databse

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     //query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
     query = "SELECT [equipmentname],[deviceid],[ip],[port],[network],[manufacturer],[modelname] FROM ["+dbName+"].[ECCAnalytics].Devices"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
           // DATA.append({'equipmentname': row[1],'deviceid': row[2],'ip': row[3],'port': row[4],'network': row[5],'manufacturer': row[6],'modelname': row[7] })

/*
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
          }
*/
          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}


const getusers = (req,res)=>{
  dbName = config.databse

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     //query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
     query = "SELECT [userid],[username],[roles],[useremailid],[pswd],[loginstatus] FROM ["+dbName+"].[ECCAnalytics].Users"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
           // DATA.append({'equipmentname': row[1],'deviceid': row[2],'ip': row[3],'port': row[4],'network': row[5],'manufacturer': row[6],'modelname': row[7] })

/*
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
          }
*/
          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}



const adduser = (req,res)=>{
  //ruleid = req.body.ruleid

  username = req.body.username
  roles = req.body.roles
  useremailid = req.body.useremailid
  pswd = req.body.pswd
  userloc = req.body.userloc
  usercampus = req.body.usercampus


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
     //make the query
  
     //var query = "SELECT [buildingname] as building FROM [ECCDB].[ECCAnalytics].[Buildings]"
     dbName = config.databse
    query = "SELECT * FROM ["+dbName+"].ECCAnalytics.Users where username ='"+username+ "'"
     request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
             //res.send(records['recordsets'][0]);
             //  your out put as records  
         // return res.status(200).json(records['recordsets'][0])
         if(records['recordsets'][0].length !=0)
         return res.status(200).json('User exists')
         else   {
              query2 = "INSERT INTO ["+dbName+"].ECCAnalytics.Users (username, roles,useremailid,pswd,userloc,usercampus) VALUES ('"+username+"','"+roles+"','"+useremailid+"','"+pswd+"','"+userloc+"','"+usercampus+"')"
              request.query(query2,function(err,records){
                if(err)
                console.log(err);
                else{

              return res.status(200).json('success')
                }
              }
              )
       }
        }
  
      }
  
  )
  })
}



const subequipmentdatapoint = (req,res)=>{
  dbName = config.databse

  eqptid = req.query.eqptid
  assoeqptid = req.query.aeid
  

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     //query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
     //query = "SELECT datapointname FROM ["+dbName+"].ECCAnalytics.SubEquipments_DataPoints where equipmenttype ='"+eqpt+"' and subequipmenttype ='"+sbeqpt+"'"
     
     //After tables are modified previous sql was not in use and following query is in place
    // query = "SELECT associatedequiptype FROM ["+dbName+"].ECCAnalytics.AssociatedEquipments where equipmentid ='"+eqptid+"' and associatedequipid ='"+assoeqptid+"'"
     query = "SELECT associatedequiptype FROM ["+dbName+"].ECCAnalytics.AssociatedEquipments where equipmentid ='"+eqptid+"' and associatedequipid in("+assoeqptid+")"
     
     request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
           // DATA.append({'equipmentname': row[1],'deviceid': row[2],'ip': row[3],'port': row[4],'network': row[5],'manufacturer': row[6],'modelname': row[7] })

/*
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
          }
*/
console.log(query);

          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}




const subequipmentlist_OLD = (req,res)=>{
  dbName = config.databse

  eqp = req.query.eqp
  


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     //query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
     query = "SELECT [subequiprecordid] as recordid  ,[subequipmenttype] FROM ["+dbName+"].ECCAnalytics.SubEquipments where equipmenttype ='"+eqp+"'"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
           // DATA.append({'equipmentname': row[1],'deviceid': row[2],'ip': row[3],'port': row[4],'network': row[5],'manufacturer': row[6],'modelname': row[7] })

/*
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
          }
*/
          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}




const subequipmentlist = (req,res)=>{
  dbName = config.databse

  eqpid = req.query.eqpid
  


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     //query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
     query = "SELECT [assoequiprecordid],[associatedequipid],[associatedequiptype] FROM ["+dbName+"].ECCAnalytics.AssociatedEquipments where equipmentid ='"+eqpid+"'"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
           // DATA.append({'equipmentname': row[1],'deviceid': row[2],'ip': row[3],'port': row[4],'network': row[5],'manufacturer': row[6],'modelname': row[7] })

/*
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
          }
*/
          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}



const postdatapoint = (req,res)=>{
  dbName = config.databse

  deviceid = req.body.deviceid
  datapoint = req.body.datapoint
  actualpoint = req.body.actualpoint
  multiply = req.body.multiply
  addition = req.body.addition
  objtype = req.body.objtype
  objinstance = req.body.objinstance
  devicerecordid = req.body.devicerecordid
  query = "INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, datapoint,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid) VALUES ('"+deviceid+"','"+datapoint+"','"+actualpoint+"','"+multiply+"','"+addition+"', CURRENT_TIMESTAMP, '"+objtype+"', '"+objinstance+"', "+devicerecordid+")"

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
 
     request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
         data = {'status':'success'}
          return res.status(200).json(data)
      }
  
      }
  
  )
  })
}



const addsubequipment = (req,res)=>{
  dbName = config.databse

equipmenttype = req.body.equipmenttype
subequipmenttype = req.body.subequipmenttype
query = "INSERT INTO ["+dbName+"].ECCAnalytics.SubEquipments (equipmenttype,subequipmenttype) VALUES ('"+equipmenttype+"','"+subequipmenttype+"')"

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
 
     request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
         data = {'status':'success'}
          return res.status(200).json(data)
      }
  
      }
  
  )
  })
}



const addequipment = (req,res)=>{
  dbName = config.databse
 
equipmenttype = req.body.equipmenttype
query = "INSERT INTO ["+dbName+"].ECCAnalytics.Equipments_Old (equipmenttype) VALUES ('"+equipmenttype+"')"

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
 
     request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
         data = {'status':'success'}
          return res.status(200).json(data)
      }
  
      }
  
  )
  })
}



const equipmentlist = (req,res)=>{
  dbName = config.databse

  eqp = req.query.eqp
  


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     //query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
     query = "SELECT [recordid],[equipmentid],[equipmenttype] FROM ["+dbName+"].ECCAnalytics.Equipments"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}



/*********************************************TEST API ********************************************************* */
const test = (req,res)=>{
    var qid = req.query.id;
    //alarmid = req.body.alarmid

    //return res.status(200).json(qid)


    const pool = new sql.ConnectionPool(config);

// Connect to the SQL Server
pool.connect().then(() => {
  // Query example
  pool.request().query('SELECT TOP (1000) [recordid],[campusname],[buildingname] FROM [ECCDB].[ECCAnalytics].[Buildings]').then(result => {
    console.log(result.recordset);
    return res.status(200).json(result.recordset)
  }).catch(err => {
    console.error('Error executing query:', err);
  }).finally(() => {
    // Close the connection pool
    pool.close();
  });
}).catch(err => {
  console.error('Error connecting to SQL Server:', err);
});


}


const bulkalarmdata = (req,res)=>{
  const pollname = req.body.pollname;
  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
     //make the query
  
      //var query = "SELECT [alarmid],[datapointrecordid] ,[ruleid] ,[deviceid],[analysisname] ,[analyticsummary],[measuretype] ,[costavoided] ,[energysaved] ,[alarmstatus],[alarmontimestamp] ,[alarmofftimestamp] ,[escalationstage] ,[buildingname] ,[taskstatus] from [ECCDB].[ECCAnalytics].[Alarm] where alarmstatus = 1 OR alarmstatus = 0 AND taskstatus = 2"
/*        var query = "SELECT [T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus],[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[T7].[equipmenttype],[T7].[subequipmenttype]  FROM [ECCDB].[ECCAnalytics].[Alarm] T1  left JOIN [ECCDB].[ECCAnalytics].[Buildings] T2 on [T1].buildingname =  [T2].buildingname left JOIN [ECCDB].[ECCAnalytics].[Campuses] T3 on [T2].[campusname] = [T3].[campusname] left JOIN [ECCDB].[ECCAnalytics].[Cities] T4 on [T4].cityname = [T3].cityname LEFT JOIN [ECCDB].[ECCAnalytics].[Countries] T5 on [T5].countryname = [T4].countryname "
      query +=  " left join [ECCDB].[ECCAnalytics].[Devices] T6 "
      query += " on [T1].[deviceid] = [T6].[deviceid] "
      query += " inner join [ECCDB].[ECCAnalytics].[SubEquipments] T7 "
      query += " on [T6].equipmentname = [T7].equipmenttype where 1 = 1 "
*/
var query = "SELECT [T10].[subequipmenttype],[T10].[equipmenttype],[T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus],[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[T1].[ruleno] FROM [ECCDB].[ECCAnalytics].[Alarm] T1  left JOIN [ECCDB].[ECCAnalytics].[Buildings] T2 "

query +=  "on [T1].buildingname =  [T2].buildingname "
query +=  " left JOIN [ECCDB].[ECCAnalytics].[Campuses] T3 "
query += " on [T2].[campusname] = [T3].[campusname] "
query +=  " left JOIN [ECCDB].[ECCAnalytics].[Cities] T4 "
query += " on [T4].cityname = [T3].cityname "
query += " LEFT JOIN [ECCDB].[ECCAnalytics].[Countries] T5 "
query += " on [T5].countryname = [T4].countryname  "
query +=  " inner join [ECCDB].[ECCAnalytics].[DataPointValue] T6"
query +=  " on [T1].datapointrecordid = [T6].datapointrecordid "
query += " inner join [ECCDB].[ECCAnalytics].[DataPoint] T7 "
query +=  " on [T6].datapoint = [T7].datapoint "
query += " inner join [ECCDB].[ECCAnalytics].[Devices] T8 "
query +=  " on [T7].deviceid = [T8].deviceid  "
query += " inner join [ECCDB].[ECCAnalytics].[Project] T9 "
query += " on [T8].equipmentname = [T9].equipmentname "
query += " inner join [ECCDB].[ECCAnalytics].[SubEquipments] T10 " 
//query += " on [T9].subequipmentname = [T10].subequipmenttype where  T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] = 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   ORDER by T1.[alarmid] "
query += " on [T9].subequipmentname = [T10].subequipmenttype where  T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] = 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   ORDER by T1.[alarmontimestamp] "
             
  
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
             //res.send(records['recordsets'][0]);
             //  your out put as records  
             var data = [];
             for (var i = 0; i < records['recordsets'][0].length; i++) { 
              data.push({alarmid: records['recordsets'][0][i]['alarmid'],datapointrecordid: records['recordsets'][0][i]['datapointrecordid'],ruleid: records['recordsets'][0][i]['ruleid'],ruleno: records['recordsets'][0][i]['ruleno'], buildingname: records['recordsets'][0][i]['buildingname'],equipmentname: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmenttype'],deviceid: records['recordsets'][0][i]['deviceid'],analysisname: records['recordsets'][0][i]['analysisname'],analyticsummary: records['recordsets'][0][i]['analyticsummary'],measuretype:records['recordsets'][0][i]['measuretype'],assigndate: records['recordsets'][0][i]['alarmontimestamp'],costavoided:records['recordsets'][0][i]['costavoided'],energysaved: records['recordsets'][0][i]['energysaved'],taskstatus: records['recordsets'][0][i]['taskstatus']});

          }
         // return res.status(200).json(records['recordsets'][0])
          return res.status(200).json(data)
      }
  
      }
  
  )
  })
}


const updatetask = (req,res)=>{

  query = '';
  dt = 22;
  for (let i = 268; i < 279; i++) {
    query += "update [ECCDB].[ECCAnalytics].[Task]  set [taskassigneddate] = cast('2022-07-"+dt+"' as date),[taskcloseddate] = cast('2022-07-"+dt+"' as date) from [ECCDB].[ECCAnalytics].[Task] Task  where [Task].[recordid] = "+i+";";
    dt++;
  }


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      var request = new sql.Request();
  
      request.query(query,function(err,records){
          if(err)
          console.log(query);
          else{
                  
            console.log('success');
            return res.status(200).json('success')

          }
      
  
      })
  })


}



/*************************************************** END OF TEST API************************************************* */




module.exports = {

    projview,
    updatetask,
    deleteproject,
    postprojectview,
    login,
    deleteuser,
    updateuser,
    getbuilding,
    getcampus,
    getcity,
    getcountry,
    getdevices,
    getusers,
    adduser,
    subequipmentdatapoint,
    subequipmentlist,
    postdatapoint,
    addsubequipment,
    addequipment,
    equipmentlist,
    test
    
}