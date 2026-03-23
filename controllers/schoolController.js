import db from "../config/db.js";
import { calculateDistance } from "../utils/distance.js";
export const addSchool = (req, res) => {

  const schools = req.body;

  if (!Array.isArray(schools)) {
    return res.status(400).json({
      message: "Request body must be an array of schools"
    });
  }

  const values = [];

  for (let school of schools) {

    const { name, address, latitude, longitude } = school;

    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({
        message: "All fields are required for each school"
      });
    }

    values.push([name, address, latitude, longitude]);
  }

  const sql = "INSERT INTO schools (name,address,latitude,longitude) VALUES ?";

  db.query(sql, [values], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Schools added successfully",
      inserted: result.affectedRows
    });

  });

};



export const listSchools = (req,res)=>{

const {latitude,longitude}=req.query;

const sql="SELECT * FROM schools";

db.query(sql,(err,schools)=>{

const sortedSchools = schools.map(school=>{

const distance = calculateDistance(
latitude,
longitude,
school.latitude,
school.longitude
);

return {...school,distance};

}).sort((a,b)=>a.distance-b.distance);

res.json(sortedSchools);

});

};