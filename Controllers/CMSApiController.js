var express = require('express');
var cors = require('cors');
var app = express();
const bodyParser = require('body-parser')
var sql = require("mssql");
const cookieParser = require('cookie-parser');
const config = require('../config/config');


const DmeServiceDataStore = (req, res, next) => {

    sql.connect(config)
    .then((conn) => {
            console.log('connected');
      
            const request = conn.request();
            let query = "SELECT * FROM [dbo].[DME_Service];"
            let result = request           
                .query(query)
                .then((result) => {
                    console.log('table records',result);
                    if (result.recordset.length > 0) {       
                        request
                            .query('truncate table [dbo].[DME_Service];')
                        
                     } 
                    else {
                        // return res.status(400).json({
                        //     success: false,
                        //     message: "unable to fetch Action Status record"
                        // });
                    }
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
                        const request = new sql.Request();
                        request.bulk(table, (err, result) => {
                            console.log(err);
                        })
                })
                .catch(err => {
                    console.log('error: ',err);
                    return (({ success: false, message: err}));
                });
    })        
    .catch(err => {
      console.log(err);
    });
}

const DmeGeographyDataStore = (req, res, next) => {

    sql.connect(config)
    .then((conn) => {
            console.log('connected');
      
            const request = conn.request();
            let query = "SELECT * FROM [dbo].[DME_Geography];"
            let result = request           
                .query(query)
                .then((result) => {                   
                     if (result.recordset.length > 0) {                        
                       
                        request
                        .query('truncate table [dbo].[DME_Geography];')
                     } 
                     else {
                        // return res.status(400).json({
                        //     success: false,
                        //     message: "unable to fetch Action Status record"
                        // });
                    }
                    const table = new sql.Table('DME_Service');
                    table.create = true;
                    Object.keys(req.body[0]).forEach(element => {              
                        table.columns.add(element.toString(), sql.NVarChar(sql.MAX), { nullable: true });
                    });
                    									
                    
                    for (let j = 0; j < req.body.length; j += 1) {
                        table.rows.add(
                            req.body[j].Rfrg_Prvdr_Geo_Lvl,
                            req.body[j].Rfrg_Prvdr_Geo_Cd,
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
                    const request = new sql.Request();
                    request.bulk(table, (err, result) => {
                        console.log(err);
                    })
                })
                .catch(err => {
                    console.log('error: ',err);
                    return (({ success: false, message: err}));
                });
    })        
    .catch(err => {
      console.log(err);
    });
}

module.exports = {
    DmeServiceDataStore,
    DmeGeographyDataStore
};