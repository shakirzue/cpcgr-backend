var express = require('express');
var cors = require('cors');
var app = express();
const bodyParser = require('body-parser')
var sql = require("mssql");
const cookieParser = require('cookie-parser');
const config = require('../config/config');

var request;

const DmeServiceDataStore =  (req, res, next) => {
    try {
        sql.connect(config)
            // .then(function () {
            //     new sql.Request()
            //         .query("IF exists (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'DME_Service') BEGIN if exists (select * from dbo.dme_geography)	begin   delete from [dbo].[DME_Service]; select 'records deleted' END END	else begin select 'no record exists' end")
            //         .then(function (dbData) {
            //             console.log(dbData);                        
            //         })
            //         .catch(function (error) {
            //             console.log(error);
            //         });
            // })
            .then(async ()=>{
                const table = new sql.Table('DME_Service');
                table.create = true;
                Object.keys(req.body[0]).forEach(element => {              
                    table.columns.add(element.toString(), sql.NVarChar(sql.MAX), { nullable: true });
                });
                for (let j = 0; j < req.body.length; j += 1) {
                    table.rows.add(
                        req.body[j].Rfrg_NPI,
                            req.body[j].Rfrg_Prvdr_Last_Name_Org,
                                req.body[j].Rfrg_Prvdr_First_Name,
                                req.body[j].Rfrg_Prvdr_MI,
                                req.body[j].Rfrg_Prvdr_Crdntls,
                                req.body[j].Rfrg_Prvdr_Gndr,
                                req.body[j].Rfrg_Prvdr_Ent_Cd,
                                req.body[j].Rfrg_Prvdr_St1,
                                req.body[j].Rfrg_Prvdr_St2,
                                req.body[j].Rfrg_Prvdr_City,
                                req.body[j].Rfrg_Prvdr_State_Abrvtn,
                                req.body[j].Rfrg_Prvdr_State_FIPS,
                                req.body[j].Rfrg_Prvdr_Zip5,
                                req.body[j].Rfrg_Prvdr_RUCA_CAT,
                                req.body[j].Rfrg_Prvdr_RUCA,
                                req.body[j].Rfrg_Prvdr_RUCA_Desc,
                                req.body[j].Rfrg_Prvdr_Cntry,
                                req.body[j].Rfrg_Prvdr_Type_cd,
                                req.body[j].Rfrg_Prvdr_Type,
                                req.body[j].Rfrg_Prvdr_Type_Flag,
                                req.body[j].BETOS_Lvl,
                                req.body[j].BETOS_Cd,
                                req.body[j].BETOS_Desc,
                                req.body[j].HCPCS_CD,
                                req.body[j].HCPCS_Desc,
                                req.body[j].Suplr_Rentl_Ind,
                                req.body[j].Tot_Suplrs,
                                req.body[j].Tot_Suplr_Benes,
                                req.body[j].Tot_Suplr_Clms,
                                req.body[j].Tot_Suplr_Srvcs,
                                req.body[j].Avg_Suplr_Sbmtd_Chrg,
                                req.body[j].Avg_Suplr_Mdcr_Alowd_Amt,
                                req.body[j].Avg_Suplr_Mdcr_Pymt_Amt,
                                req.body[j].Avg_Suplr_Mdcr_Stdzd_Amt 
                    );
                }    
            
                const tableReq = new sql.Request();
                await tableReq.bulk(table, (err, result) => {
                    // sql.close();
                    console.log("Bulk insertion: ",result);
                    if(err){
                        console.log(err);
                        return res.json({
                            success: false,
                            message: err.toString()
                        });
                    }
                    return res.json({
                        success: true,
                        message: "DME Service api records saved successfully"
                    });
                });
            })
            .catch(function (error) {
                return res.json({
                    success: false,
                    message: error.toString()
                });
            });           
    } catch (error) {
        console.dir(error);
    }    
}

 const DmeGeographyDataStore =  (req, res, next) => {
    try {
        sql.connect(config)
            // .then(function () {
            //     new sql.Request()
            //         .query("IF exists (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'DME_Geography') BEGIN if exists (select * from dbo.dme_geography)	begin	delete from [dbo].[DME_Geography]; select 'records deleted' end END	else begin select 'no record exists' end")
            //         .then(function (dbData) {
            //             console.log(dbData);                        
            //         })
            //         .catch(function (error) {
            //             console.dir(error);
            //         });
            // })
            .then(async ()=>{
                const table = new sql.Table('DME_Geography');
                table.create = true;
                Object.keys(req.body[0]).forEach(element => {              
                    table.columns.add(element.toString(), sql.NVarChar(sql.MAX), { nullable: true });
                });
                for (let j = 0; j < req.body.length; j += 1) {
                    table.rows.add(
                        req.body[j].Rfrg_Prvdr_Geo_Lvl,
                        req.body[j].Rfrg_Prvdr_Geo_Lvl,
                        req.body[j].Rfrg_Prvdr_Geo_Desc,
                        req.body[j].BETOS_Lvl,
                        req.body[j].BETOS_Cd,
                        req.body[j].BETOS_Desc,
                        req.body[j].HCPCS_Cd,
                        req.body[j].HCPCS_Desc,
                        req.body[j].Suplr_Rentl_Ind,
                        req.body[j].Tot_Rfrg_Prvdrs,
                        req.body[j].Tot_Suplrs,
                        req.body[j].Tot_Suplr_Benes,
                        req.body[j].Tot_Suplr_Clms,
                        req.body[j].Tot_Suplr_Srvcs,
                        req.body[j].Avg_Suplr_Sbmtd_Chrg,                     
                        req.body[j].Avg_Suplr_Mdcr_Alowd_Amt,
                        req.body[j].Avg_Suplr_Mdcr_Pymt_Amt,
                        req.body[j].Avg_Suplr_Mdcr_Stdzd_Amt  
                    );
                }    
            
                const tableReq = new sql.Request();
                await tableReq.bulk(table, (err, result) => {
                    // sql.close();
                    console.log("Bulk insertion: ",result);
                    if(err){
                        console.log(err);
                        return res.json({
                            success: false,
                            message: err.toString()
                        });
                    }
                    return res.json({
                        success: true,
                        message: "DME Geography api records saved successfully"
                    });
                });
            })
            .catch(function (error) {
                return res.json({
                    success: false,
                    message: error.toString()
                });
            });           
    } catch (error) {
        return res.json({
            success: false,
            message: error.toString()
        });
    }    
}

const DmeDeleteExistingData = (req, res, next) =>{
    try {
        console.log(req.body.tableName)
        sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        request = new sql.Request();

        // query to the database and get the records
            let query = "truncate table [dbo].["+req.body.tableName+"];"
            request.query(query, function (err, result) {
                if (err) console.log(err)
                console.log(result);
                // if (result.recordset.length > 0) {
                    return res.json({
                        success: true,
                        message: "record deleted successfully."
                    });
                // } else {
                //     return res.status(400).json({
                //         isAuth: false,
                //         message: "unable to delete record"
                //     });
                // }
            });
        });
    } 
    catch (error) {
        return res.json({
            success: false,
            message: error.toString()
        });
    }    
}

module.exports = {
    DmeServiceDataStore,
    DmeGeographyDataStore,
    DmeDeleteExistingData
};